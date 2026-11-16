// Единый источник данных о товарах для всего приложения.
// Загрузка происходит один раз; все компоненты подписаны на один стор.

import { fetch_products } from "./products_api";

const LOAD_TIMEOUT_MS = 12000;

let state = { status: "idle", products: [], error: null };
let load_promise = null;
const listeners = new Set();

function set_state(patch) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
}

export function subscribe_products(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function get_products_state() {
    return state;
}

export function load_products(force = false) {
    if (load_promise) return load_promise;
    if (state.status === "ready" && !force) return Promise.resolve(state.products);

    set_state({ status: "loading", error: null });

    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Сервер не отвечает. Повторите запрос.")), LOAD_TIMEOUT_MS);
    });

    load_promise = Promise.race([fetch_products(), timeout])
        .then((list) => {
            set_state({ status: "ready", products: list, error: null });
            return list;
        })
        .catch((error) => {
            set_state({ status: "error", products: [], error: error?.message || "Не удалось загрузить товары" });
            return [];
        })
        .finally(() => {
            load_promise = null;
        });

    return load_promise;
}
