// Приоритетная очередь загрузки файлов.
// Через неё проходит ВСЁ: JSON-данные и картинки.
//   • ограниченное число одновременных загрузок;
//   • 4 уровня приоритета, внутри уровня — FIFO;
//   • отмена через AbortController и повышение приоритета на лету;
//   • симуляция медленной сети — приоритеты видны без throttling в DevTools.

export const PRIORITY = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };

export const PRIORITY_META = {
    [PRIORITY.CRITICAL]: { short: "CRIT", name: "Критический", badge: "border-rose-500/40 bg-rose-500/15 text-rose-400" },
    [PRIORITY.HIGH]:     { short: "HIGH", name: "Высокий",     badge: "border-amber-500/40 bg-amber-500/15 text-amber-400" },
    [PRIORITY.NORMAL]:   { short: "MED",  name: "Обычный",     badge: "border-sky-500/40 bg-sky-500/15 text-sky-400" },
    [PRIORITY.LOW]:      { short: "LOW",  name: "Низкий",      badge: "border-slate-500/40 bg-slate-500/15 text-slate-400" },
};

export const NETWORK_PROFILES = {
    lan: { label: "Быстрый (LAN)", latency_ms: 60,   jitter_ms: 80 },
    "4g": { label: "4G",           latency_ms: 300,  jitter_ms: 250 },
    "3g": { label: "3G",           latency_ms: 900,  jitter_ms: 500 },
    "2g": { label: "Медленный (2G)", latency_ms: 2200, jitter_ms: 1000 },
};

export function format_bytes(value) {
    if (!value) return "—";
    if (value < 1024) return `${value} Б`;
    if (value < 1048576) return `${(value / 1024).toFixed(0)} КБ`;
    return `${(value / 1048576).toFixed(1)} МБ`;
}

function abort_error() {
    return new DOMException("Загрузка отменена", "AbortError");
}

function abortable_sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(abort_error());
        const on_abort = () => { clearTimeout(timer_id); reject(abort_error()); };
        const timer_id = setTimeout(() => {
            signal?.removeEventListener("abort", on_abort);
            resolve();
        }, ms);
        signal?.addEventListener("abort", on_abort, { once: true });
    });
}

// Качает файл как blob и репортит прогресс (0..1) и размер в байтах.
export async function fetch_file_with_progress(url, signal, on_progress) {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const total = Number(response.headers.get("content-length")) || 0;

    if (!response.body || !total) {
        const blob = await response.blob();
        on_progress(1, blob.size);
        return blob;
    }

    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        on_progress(Math.min(1, received / total), received);
    }
    return new Blob(chunks, { type: response.headers.get("content-type") || "image/jpeg" });
}

function public_task(task) {
    return {
        id: task.id,
        label: task.label,
        url: task.url,
        kind: task.kind,
        priority: task.priority,
        status: task.status,
        phase: task.phase,
        progress: task.progress,
        size: task.size,
        error_note: task.error_note,
        duration_ms: task.finished_at && task.started_at ? task.finished_at - task.started_at : 0,
    };
}

class Request_Queue {
    constructor() {
        this.concurrency = 3;
        this.network_key = "lan"; // быстрая сеть по умолчанию; задержку можно изменить в панели
        this.paused = false;
        this._tasks = new Map();
        this._pending = [];
        this._active = new Set();
        this._history = [];
        this._seq = 0;
        this._listeners = new Set();
        this._snapshot = null;
        this._emit_timer = null;
        this._stats = { done: 0, error: 0, cancelled: 0, bytes: 0 };
    }

    subscribe = (listener) => {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    };

    get_snapshot = () => {
        if (!this._snapshot) {
            const pending = this._sorted_pending()
                .map((id) => this._tasks.get(id))
                .filter(Boolean)
                .map(public_task);
            const active = [...this._active]
                .map((id) => this._tasks.get(id))
                .filter(Boolean)
                .map(public_task);
            this._snapshot = {
                concurrency: this.concurrency,
                network_key: this.network_key,
                paused: this.paused,
                pending,
                active,
                history: this._history,
                stats: {
                    ...this._stats,
                    queued: pending.length,
                    active: active.length,
                },
            };
        }
        return this._snapshot;
    };

    add({ label, url = "", kind = "data", priority = PRIORITY.NORMAL, run, signal }) {
        const id = ++this._seq;
        const task = {
            id, seq: id, label, url, kind, priority, run,
            status: "queued", phase: "queued", progress: 0, size: 0, error_note: "",
            started_at: 0, finished_at: 0,
            controller: new AbortController(),
            resolve: null, reject: null,
        };
        const promise = new Promise((resolve, reject) => {
            task.resolve = resolve;
            task.reject = reject;
        });
        promise.catch(() => {}); // страховка от unhandled rejection при отмене

        this._tasks.set(id, task);
        this._pending.push(id);

        if (signal) {
            if (signal.aborted) this.cancel(id);
            else signal.addEventListener("abort", () => this.cancel(id), { once: true });
        }
        this._pump();
        return {
            id,
            promise,
            cancel: () => this.cancel(id),
            set_priority: (p) => this.set_priority(id, p),
        };
    }

    cancel(id) {
        const task = this._tasks.get(id);
        if (!task) return;
        if (task.status === "active") {
            task.controller.abort();
            return;
        }
        if (task.status !== "queued") return;
        this._pending = this._pending.filter((x) => x !== id);
        task.status = "cancelled";
        task.finished_at = performance.now();
        this._stats.cancelled += 1;
        this._finish(task);
        task.reject(abort_error());
        this._pump();
    }

    set_priority(id, priority) {
        const task = this._tasks.get(id);
        if (!task || task.status !== "queued") return;
        task.priority = Math.max(PRIORITY.CRITICAL, Math.min(PRIORITY.LOW, priority));
        this._pump();
    }

    set_concurrency(value) {
        this.concurrency = Math.max(1, Math.min(6, value));
        this._pump();
    }

    set_network(key) {
        if (NETWORK_PROFILES[key]) {
            this.network_key = key;
            this._emit();
        }
    }

    pause() { this.paused = true; this._emit(); }
    resume() { this.paused = false; this._pump(); }

    clear_history() {
        this._history = [];
        this._stats = { done: 0, error: 0, cancelled: 0, bytes: 0 };
        this._emit();
    }

    _sorted_pending() {
        return [...this._pending].sort((a, b) => {
            const ta = this._tasks.get(a);
            const tb = this._tasks.get(b);
            return ta.priority - tb.priority || ta.seq - tb.seq;
        });
    }

    _pump() {
        if (!this.paused) {
            while (this._active.size < this.concurrency && this._pending.length > 0) {
                const id = this._sorted_pending().shift();
                this._pending = this._pending.filter((x) => x !== id);
                const task = this._tasks.get(id);
                if (task && task.status === "queued") this._start(task);
            }
        }
        this._emit();
    }

    async _start(task) {
        task.status = "active";
        task.phase = "waiting";
        task.started_at = performance.now();
        this._active.add(task.id);
        this._emit();

        const profile = NETWORK_PROFILES[this.network_key];
        const wait_ms = profile.latency_ms + Math.random() * profile.jitter_ms;
        try {
            await abortable_sleep(wait_ms, task.controller.signal);
            task.phase = "downloading";
            this._emit();
            const result = await task.run(task.controller.signal, (progress, size) => {
                task.progress = progress;
                if (size) task.size = size;
                this._schedule_emit();
            });
            task.status = "done";
            task.progress = 1;
            task.finished_at = performance.now();
            this._stats.done += 1;
            this._stats.bytes += task.size || 0;
            task.resolve(result);
        } catch (error) {
            task.finished_at = performance.now();
            if (task.controller.signal.aborted) {
                task.status = "cancelled";
                this._stats.cancelled += 1;
                task.reject(abort_error());
            } else {
                task.status = "error";
                task.error_note = error?.message || "Ошибка сети";
                this._stats.error += 1;
                task.reject(error);
            }
        } finally {
            this._active.delete(task.id);
            this._finish(task);
            this._pump();
        }
    }

    _finish(task) {
        this._tasks.delete(task.id);
        this._history.unshift(public_task(task));
        if (this._history.length > 40) this._history.pop();
    }

    _emit() {
        this._snapshot = null;
        this._listeners.forEach((fn) => fn());
    }

    _schedule_emit() {
        if (this._emit_timer) return;
        this._emit_timer = setTimeout(() => {
            this._emit_timer = null;
            this._emit();
        }, 80);
    }
}

export const request_queue = new Request_Queue();