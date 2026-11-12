import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Popular/ProductCard";
import { CATEGORY_ORDER, products } from "../data/popular";

const SORT_OPTIONS = [
    { value: "default", label: "По умолчанию" },
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
];

function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") || "";

    const [query, setQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState("default");

    const setCategory = (name) => {
        if (name) {
            setSearchParams({ category: name });
        } else {
            setSearchParams({});
        }
    };

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = products.filter((p) => {
            if (category && p.category !== category) return false;
            if (inStockOnly && !p.inStock) return false;
            if (q && !p.name.toLowerCase().includes(q)) return false;
            return true;
        });

        if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

        return list;
    }, [category, query, inStockOnly, sort]);

    const categories = ["", ...CATEGORY_ORDER];

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                        Каталог
                    </p>
                    <h1 className="text-4xl font-medium tracking-tight text-gray-950">
                        Все товары
                    </h1>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
                    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-7">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                                    Категории
                                </p>
                                <div className="mt-3 flex flex-col gap-1">
                                    {categories.map((name) => {
                                        const active = category === name;
                                        return (
                                            <button
                                                key={name || "all"}
                                                type="button"
                                                onClick={() => setCategory(name)}
                                                className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                                    active
                                                        ? "bg-gray-100 font-semibold text-gray-950"
                                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-950"
                                                }`}
                                            >
                                                {name || "Все категории"}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <label htmlFor="in-stock" className="text-sm font-medium">
                                    Только в наличии
                                </label>
                                <input
                                    id="in-stock"
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="h-4 w-4 accent-emerald-900"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setQuery("");
                                    setInStockOnly(false);
                                    setSort("default");
                                    setCategory("");
                                }}
                                className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
                            >
                                Очистить фильтры
                            </button>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Поиск по названию"
                                className="h-10 flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                            />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm sm:w-52"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            Найдено: <span className="font-semibold text-gray-950">{visible.length}</span>
                        </p>

                        {visible.length > 0 ? (
                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {visible.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
                                По этим фильтрам ничего не найдено.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CatalogPage;
