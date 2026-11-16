import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Products_Grid from "../components/Popular/Products_Grid";
import { useProducts } from "../hooks/useProducts";
import { CATEGORY_ORDER, formatPrice } from "../data/popular";
import { categoryCounts } from "../utils/catalogFilters";

const MAX_PRICE = 250;
const SORT_OPTIONS = [
    { value: "default", label: "По умолчанию" },
    { value: "popular", label: "Сначала популярные" },
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
    { value: "name", label: "По названию" },
];

function CatalogPage() {
    const [search_params, set_search_params] = useSearchParams();
    const urlQuery = search_params.get("q") || "";
    const [searchInput, setSearchInput] = useState({ source: urlQuery, value: urlQuery });
    const query = searchInput.source === urlQuery ? searchInput.value : urlQuery;
    const category = search_params.get("category") || "";
    const inStock = search_params.get("stock") === "1";
    const onlySweet = search_params.get("sweet") === "1";
    const onlyNew = search_params.get("new") === "1";
    const sort = search_params.get("sort") || "default";
    const maxParam = search_params.get("max");
    const maximum = maxParam === null ? MAX_PRICE : Math.min(MAX_PRICE, Math.max(0, Number(maxParam) || 0));


    const setFilter = (key, value) => {
        set_search_params((old) => {
            const next = new URLSearchParams(old);
            if (value === "" || value === null || value === undefined) next.delete(key);
            else next.set(key, String(value));
            return next;
        }, { replace: true });
    };

    const { products, all_products, is_loading, error, reload } = useProducts({
        category, search: query, in_stock: inStock, sweet_only: onlySweet, max_price: maximum, sort,
    });
    const visible = useMemo(() => onlyNew ? products.filter((product) => product.isNew) : products, [products, onlyNew]);
    const categories = useMemo(() => [...new Set(all_products.map((product) => product.category))]
        .sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)), [all_products]);
    const counts = useMemo(() => categoryCounts(all_products, {
        search: query, in_stock: inStock, sweet_only: onlySweet, new_only: onlyNew, max_price: maximum,
    }), [all_products, query, inStock, onlySweet, onlyNew, maximum]);

    const reset = () => { setSearchInput({ source: urlQuery, value: "" }); set_search_params({}, { replace: true }); };
    const filtersApplied = Boolean(category || query || inStock || onlySweet || onlyNew || maximum < MAX_PRICE || sort !== "default");

    return (
        <section className="catalog-page">
            <div className="catalog-top"><div className="container-wide">
                <span className="eyebrow">ВЫБИРАЙТЕ С УДОВОЛЬСТВИЕМ</span>
                <div className="catalog-title-line"><div><h1 className="font-display">Всё самое <em>вкусное</em></h1><p>Свежая выпечка, ароматный хлеб и десерты для хорошего дня.</p></div><span className="catalog-flower" aria-hidden="true">✳</span></div>
            </div></div>
            <div className="container-wide catalog-layout">
                <aside className="filters-card" aria-label="Фильтры каталога">
                    <div className="filter-heading"><h2 className="font-display">Фильтры</h2><span>✳</span></div>
                    <div className="filter-group">
                        <h3>Категории</h3>
                        <div className="category-filter-list">
                            <button type="button" onClick={() => setFilter("category", "")} className={`filter-category ${!category ? "chosen" : ""}`}><span>Все товары</span><span>{counts.all}</span></button>
                            {categories.map((name) => <button type="button" key={name} onClick={() => setFilter("category", name)} className={`filter-category ${category === name ? "chosen" : ""}`}><span>{name}</span><span>{counts.byCategory[name] || 0}</span></button>)}
                        </div>
                    </div>
                    <div className="filter-group">
                        <div className="flex items-center justify-between"><h3>Цена до</h3><strong className="text-[#ab6036]">{formatPrice(maximum)}</strong></div>
                        <input className="price-slider" type="range" min="0" max={MAX_PRICE} step="5" value={maximum} onChange={(event) => setFilter("max", Number(event.target.value) === MAX_PRICE ? "" : event.target.value)} aria-label="Максимальная цена" />
                        <div className="flex justify-between text-xs text-[#958477]"><span>0 ₽</span><span>{formatPrice(MAX_PRICE)}</span></div>
                    </div>
                    <div className="filter-group"><h3>Ещё параметры</h3>
                        <label className="filter-check"><input type="checkbox" checked={inStock} onChange={(event) => setFilter("stock", event.target.checked ? "1" : "")} /><span>Только в наличии</span></label>
                        <label className="filter-check"><input type="checkbox" checked={onlySweet} onChange={(event) => setFilter("sweet", event.target.checked ? "1" : "")} /><span>Сладкая выпечка</span></label>
                        <label className="filter-check"><input type="checkbox" checked={onlyNew} onChange={(event) => setFilter("new", event.target.checked ? "1" : "")} /><span>Новинки</span></label>
                    </div>
                    <button type="button" onClick={reset} disabled={!filtersApplied} className="clear-filters">Сбросить все фильтры ↗</button>
                    <p className="mock-api-hint">Учебный проект · Mock Fetch API</p>
                </aside>
                <div className="catalog-content">
                    <div className="catalog-toolbar">
                        <label className="catalog-search"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><input type="search" value={query} placeholder="Поиск по названию и составу..." onChange={(event) => { setSearchInput({ source: urlQuery, value: event.target.value }); setFilter("q", event.target.value); }} aria-label="Поиск по товарам" /></label>
                        <select aria-label="Сортировка" className="catalog-sort" value={sort} onChange={(event) => setFilter("sort", event.target.value === "default" ? "" : event.target.value)}>{SORT_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
                    </div>
                    <div className="catalog-result-row"><p>{is_loading ? "Загружаем выпечку..." : error ? "Ошибка загрузки" : <>Найдено: <strong>{visible.length}</strong> {visible.length === 1 ? "товар" : "товаров"}</>}</p>{filtersApplied && <button type="button" onClick={reset}>Очистить всё ×</button>}</div>
                    {filtersApplied && <div className="active-chips" aria-label="Активные фильтры">
                        {category && <button type="button" onClick={() => setFilter("category", "")}>{category} ×</button>}
                        {query && <button type="button" onClick={() => {setSearchInput({ source: urlQuery, value: "" }); setFilter("q", "");}}>Поиск: {query} ×</button>}
                        {inStock && <button type="button" onClick={() => setFilter("stock", "")}>В наличии ×</button>}
                        {onlySweet && <button type="button" onClick={() => setFilter("sweet", "")}>Сладкое ×</button>}
                        {onlyNew && <button type="button" onClick={() => setFilter("new", "")}>Новинки ×</button>}
                        {maximum < MAX_PRICE && <button type="button" onClick={() => setFilter("max", "")}>До {formatPrice(maximum)} ×</button>}
                    </div>}
                    <Products_Grid products={visible} is_loading={is_loading} error={error} on_retry={reload} empty_text="Попробуйте изменить запрос или убрать часть фильтров." />
                </div>
            </div>
        </section>
    );
}
export default CatalogPage;
