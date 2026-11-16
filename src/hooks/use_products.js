import { useEffect, useMemo, useSyncExternalStore } from "react";
import { get_products_state, load_products, subscribe_products } from "../api/products_store";

// Все компоненты читают один стор. Фильтрация — локальная, мгновенная.
export function use_products(params = {}) {
    const { category = "", search = "", in_stock = false, sort = "default", limit } = params;
    const state = useSyncExternalStore(subscribe_products, get_products_state);

    useEffect(() => {
        load_products();
    }, []);

    const products = useMemo(() => {
        const q = search.trim().toLowerCase();
        let list = state.products.filter((p) => {
            if (category && p.category !== category) return false;
            if (in_stock && !p.inStock) return false;
            if (q && !p.name.toLowerCase().includes(q)) return false;
            return true;
        });
        if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
        if (limit) list = list.slice(0, limit);
        return list;
    }, [state.products, category, search, in_stock, sort, limit]);

    return {
        products,
        is_loading: state.status === "idle" || state.status === "loading",
        error: state.status === "error" ? state.error : null,
        reload: () => load_products(true),
    };
}