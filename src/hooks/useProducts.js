import { useEffect, useMemo, useSyncExternalStore } from "react";
import { get_products_state, load_products, subscribe_products } from "../api/products_store";
import { filterProducts } from "../utils/catalogFilters";

// Все компоненты читают один стор. Фильтрация — локальная, мгновенная.
export function useProducts(params = {}) {
    const { category = "", search = "", in_stock = false, sort = "default", limit, min_price, max_price, sweet_only = false, popular_only = false } = params;
    const state = useSyncExternalStore(subscribe_products, get_products_state);

    useEffect(() => {
        load_products();
    }, []);

    const products = useMemo(() => filterProducts(state.products, {
        category, search, in_stock, sort, limit, min_price, max_price, sweet_only, popular_only,
    }), [state.products, category, search, in_stock, sort, limit, min_price, max_price, sweet_only, popular_only]);

    return {
        products,
        all_products: state.products,
        is_loading: state.status === "idle" || state.status === "loading",
        error: state.status === "error" ? state.error : null,
        reload: () => load_products(true),
    };
}