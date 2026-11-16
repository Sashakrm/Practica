import { useState, useSyncExternalStore } from "react";
import { NETWORK_PROFILES, PRIORITY_META, format_bytes, request_queue } from "../../api/request_queue";

const ghost_btn = "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-700 hover:text-white";

function Status_Icon({ task }) {
    if (task.status === "active")
        return <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />;
    if (task.status === "done") return <span className="text-xs font-bold text-emerald-400">✓</span>;
    if (task.status === "error") return <span className="text-xs font-bold text-rose-400">!</span>;
    if (task.status === "cancelled") return <span className="text-xs text-slate-500">✕</span>;
    return <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-500" />;
}

function meta_line(task) {
    if (task.status === "queued") return `в очереди · ${PRIORITY_META[task.priority].name.toLowerCase()}`;
    if (task.status === "active")
        return task.phase === "waiting"
            ? "ожидание сети (симуляция)…"
            : `загрузка · ${Math.round(task.progress * 100)}% · ${format_bytes(task.size)}`;
    if (task.status === "done") return `${(task.duration_ms / 1000).toFixed(1)} с · ${format_bytes(task.size)}`;
    if (task.status === "cancelled") return "отменён";
    return task.error_note || "ошибка";
}

function Task_Row({ task }) {
    const meta = PRIORITY_META[task.priority];
    const is_active = task.status === "active";
    const is_queued = task.status === "queued";
    const dim = task.status === "cancelled" || task.status === "error";

    return (
        <li className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${is_active ? "bg-slate-800/80" : "hover:bg-slate-800/40"} ${dim ? "opacity-60" : ""}`}>
            <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-wider ${meta.badge}`} title={meta.name}>
                {meta.short}
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-slate-200">{task.label}</p>
                {is_active && (
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-700">
                        <div
                            className={`h-full rounded-full bg-emerald-400 transition-all duration-200 ${task.phase === "waiting" ? "w-full animate-pulse opacity-30" : ""}`}
                            style={task.phase === "waiting" ? undefined : { width: `${Math.max(4, Math.round(task.progress * 100))}%` }}
                        />
                    </div>
                )}
                <p className="mt-0.5 truncate text-[10px] text-slate-500">{meta_line(task)}</p>
            </div>
            <Status_Icon task={task} />
            {is_queued && task.priority > 0 && (
                <button type="button" title="Повысить приоритет" onClick={() => request_queue.set_priority(task.id, task.priority - 1)} className={ghost_btn}>
                    ↑
                </button>
            )}
            {(is_queued || is_active) && (
                <button type="button" title="Отменить загрузку" onClick={() => request_queue.cancel(task.id)} className={`${ghost_btn} hover:text-rose-400`}>
                    ✕
                </button>
            )}
        </li>
    );
}

function Section({ title, tasks }) {
    if (tasks.length === 0) return null;
    return (
        <div>
            <p className="px-2.5 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {title} · {tasks.length}
            </p>
            <ul className="space-y-0.5">
                {tasks.map((task) => (
                    <Task_Row key={task.id} task={task} />
                ))}
            </ul>
        </div>
    );
}

function Queue_Panel() {
    const snap = useSyncExternalStore(request_queue.subscribe, request_queue.get_snapshot);
    const [is_open, set_is_open] = useState(false);
    const { stats } = snap;
    const is_busy = stats.active > 0;

    if (!is_open) {
        return (
            <button
                type="button"
                onClick={() => set_is_open(true)}
                className="fixed bottom-4 right-4 z-50 flex h-11 items-center gap-2.5 rounded-full border border-slate-700 bg-slate-950/95 px-4 text-sm font-medium text-white shadow-2xl backdrop-blur transition-transform hover:scale-[1.03]"
            >
                <span className={`h-2 w-2 rounded-full ${is_busy ? "animate-pulse bg-emerald-400" : "bg-slate-500"}`} />
                Очередь
                <span className="font-mono text-xs text-slate-400">
                    {stats.active}⚡ {stats.queued}⏳
                </span>
            </button>
        );
    }

    const is_empty = snap.active.length === 0 && snap.pending.length === 0 && snap.history.length === 0;

    return (
        <aside className="fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-slate-700/70 bg-slate-950/95 text-slate-200 shadow-2xl backdrop-blur sm:left-auto sm:w-[400px]">
            <div className="flex items-center gap-2.5 p-3 pb-2">
                <span className={`h-2.5 w-2.5 rounded-full ${is_busy ? "animate-pulse bg-emerald-400" : "bg-slate-600"}`} />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">Очередь загрузки</p>
                    <p className="text-[10px] text-slate-500">приоритетный планировщик файлов</p>
                </div>
                <button
                    type="button"
                    title={snap.paused ? "Продолжить запуск новых задач" : "Приостановить запуск новых задач"}
                    onClick={() => (snap.paused ? request_queue.resume() : request_queue.pause())}
                    className={`${ghost_btn} ${snap.paused ? "text-amber-400" : ""}`}
                >
                    {snap.paused ? "▶" : "❚❚"}
                </button>
                <button type="button" title="Свернуть" onClick={() => set_is_open(false)} className={ghost_btn}>
                    —
                </button>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2 px-3 pb-2">
                <label className="block">
                    <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Сеть (симуляция)</span>
                    <select
                        value={snap.network_key}
                        onChange={(e) => request_queue.set_network(e.target.value)}
                        className="h-8 w-full rounded-md border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                        {Object.entries(NETWORK_PROFILES).map(([key, p]) => (
                            <option key={key} value={key}>{p.label}</option>
                        ))}
                    </select>
                </label>
                <div>
                    <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Потоки</span>
                    <div className="flex h-8 items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-1">
                        <button type="button" onClick={() => request_queue.set_concurrency(snap.concurrency - 1)} disabled={snap.concurrency <= 1} className={`${ghost_btn} disabled:opacity-30`}>−</button>
                        <span className="w-5 text-center font-mono text-sm font-bold text-emerald-400">{snap.concurrency}</span>
                        <button type="button" onClick={() => request_queue.set_concurrency(snap.concurrency + 1)} disabled={snap.concurrency >= 6} className={`${ghost_btn} disabled:opacity-30`}>+</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 border-y border-slate-800 px-3 py-1.5 font-mono text-[10px] text-slate-400">
                <span>⏳ <b className="text-sky-400">{stats.queued}</b></span>
                <span>⚡ <b className="text-emerald-400">{stats.active}/{snap.concurrency}</b></span>
                <span>✓ <b className="text-slate-200">{stats.done}</b></span>
                <span>✕ <b className="text-slate-500">{stats.cancelled}</b></span>
                <span>! <b className="text-rose-400">{stats.error}</b></span>
                <span className="ml-auto">{format_bytes(stats.bytes)}</span>
            </div>

            <div className="queue-scroll max-h-[38vh] overflow-y-auto px-1.5 pb-2 sm:max-h-[320px]">
                {is_empty ? (
                    <p className="p-6 text-center text-xs text-slate-500">
                        Очередь пуста. Открой каталог или смени фильтры — задачи появятся здесь.
                    </p>
                ) : (
                    <>
                        <Section title="Загружается" tasks={snap.active} />
                        <Section title="В очереди" tasks={snap.pending} />
                        <Section title="Недавние" tasks={snap.history} />
                    </>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2">
                <p className="text-[10px] text-slate-500">Данные и картинки — через один планировщик</p>
                <button type="button" onClick={() => request_queue.clear_history()} className="rounded-md px-2 py-1 text-[10px] font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                    Очистить
                </button>
            </div>
        </aside>
    );
}

export default Queue_Panel;