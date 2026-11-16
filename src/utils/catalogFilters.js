// Чистые функции каталога: одинаковые правила для mock API и React.
export function filterProducts(products, params = {}) {
    const {
        category = "", search = "", in_stock = false, sort = "default", limit,
        min_price, max_price, sweet_only = false, popular_only = false, new_only = false,
    } = params;
    const query = search.trim().toLocaleLowerCase("ru");
    let filtered = products.filter((product) => {
        if (category && product.category !== category) return false;
        if (in_stock && !product.inStock) return false;
        if (sweet_only && !product.sweet) return false;
        if (popular_only && !product.isPopular) return false;
        if (new_only && !product.isNew) return false;
        if (min_price !== undefined && product.price < Number(min_price)) return false;
        if (max_price !== undefined && product.price > Number(max_price)) return false;
        if (query && !`${product.name} ${product.description || ""} ${product.ingredients || ""}`.toLocaleLowerCase("ru").includes(query)) return false;
        return true;
    });
    if (sort === "name") filtered = filtered.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    if (sort === "popular") filtered = filtered.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    if (sort === "price-asc") filtered = filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered = filtered.sort((a, b) => b.price - a.price);
    if (limit !== undefined) filtered = filtered.slice(0, Number(limit));
    return filtered;
}

export function categoryCounts(products, params = {}) {
    const all = filterProducts(products, { ...params, category: "", sort: "default", limit: undefined });
    return { all: all.length, byCategory: Object.fromEntries([...new Set(products.map((p) => p.category))].map((name) => [name, all.filter((p) => p.category === name).length])) };
}
