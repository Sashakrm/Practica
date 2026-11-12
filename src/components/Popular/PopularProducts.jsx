import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "../../data/popular";

function PopularProducts() {
    return (
        <section className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                            Каталог
                        </p>
                        <h2 className="text-3xl font-medium tracking-tight text-gray-950">
                            Популярные товары
                        </h2>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                    >
                        Весь каталог →
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularProducts;
