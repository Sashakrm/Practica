import { useEffect, useRef, useState } from "react";
import { PRIORITY, fetch_file_with_progress, request_queue } from "../../api/request_queue";

// Картинка, которая качается через очередь:
//   • в очереди — шиммер с процентом;
//   • при приближении к viewport приоритет повышается до HIGH;
//   • при размонтировании задача отменяется, objectURL освобождается;
//   • если fetch заблокирован (CORS/сеть) — тихий fallback на прямой src.
function Queued_Image({ src, alt, label, priority = PRIORITY.NORMAL, img_class_name = "" }) {
    const wrap_ref = useRef(null);
    const url_ref = useRef(null);
    const [state, set_state] = useState({ status: "queued", progress: 0, url: null, broken: false });

    useEffect(() => {
        let is_actual = true;

        const task = request_queue.add({
            label: `IMG ${label || alt || "изображение"}`,
            url: src,
            kind: "image",
            priority,
            run: async (signal, report) => {
                const blob = await fetch_file_with_progress(src, signal, (p, size) => {
                    report(p, size);
                    if (is_actual) set_state((s) => ({ ...s, status: "loading", progress: p }));
                });
                return URL.createObjectURL(blob);
            },
        });

        task.promise
            .then((object_url) => {
                if (!is_actual) {
                    URL.revokeObjectURL(object_url);
                    return;
                }
                if (url_ref.current) URL.revokeObjectURL(url_ref.current);
                url_ref.current = object_url;
                set_state({ status: "done", progress: 1, url: object_url, broken: false });
            })
            .catch((error) => {
                if (!is_actual || error?.name === "AbortError") return;
                set_state({ status: "done", progress: 1, url: src, broken: false });
            });

        const node = wrap_ref.current;
        let observer = null;
        if (node && "IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((e) => e.isIntersecting)) {
                        task.set_priority(PRIORITY.HIGH);
                        observer.disconnect();
                    }
                },
                { rootMargin: "250px" }
            );
            observer.observe(node);
        }

        return () => {
            is_actual = false;
            task.cancel();
            if (observer) observer.disconnect();
            if (url_ref.current) {
                URL.revokeObjectURL(url_ref.current);
                url_ref.current = null;
            }
        };
    }, [src, priority, label, alt]);

    const is_done = state.status === "done";

    return (
        <div ref={wrap_ref} className="relative h-full w-full overflow-hidden bg-gray-100">
            {!is_done && (
                <div className="queue-shimmer absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {state.status === "loading" ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
                            <span className="font-mono text-[11px] font-medium text-gray-500">
                                {Math.round(state.progress * 100)}%
                            </span>
                        </>
                    ) : (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                            <span className="h-2 w-2 rounded-full border border-gray-400" />
                            в очереди
                        </span>
                    )}
                </div>
            )}
            {is_done && !state.broken && (
                <img
                    src={state.url}
                    alt={alt}
                    onError={() => set_state((s) => ({ ...s, broken: true }))}
                    className={`queue-img-in h-full w-full object-cover ${img_class_name}`}
                />
            )}
            {is_done && state.broken && (
                <img src="/images/bakery-placeholder.svg" alt="Изображение выпечки недоступно" className="h-full w-full object-cover" />
            )}
        </div>
    );
}

export default Queued_Image;