import { Link } from "react-router-dom";
import { formatPrice, photoUrl } from "../../data/popular";

function ProductCard({ product }) {
    const { id, name, category, price, inStock, photo } = product;

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-gray-300">
            <Link
                to={`/products/${id}`}
                className="group block aspect-[4/3] overflow-hidden bg-gray-100"
            >
                <img
                    src={photoUrl(photo)}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-gray-500">{category}</p>

                <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-950">
                    <Link to={`/products/${id}`} className="hover:underline">
                        {name}
                    </Link>
                </h3>

                <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[15px] font-semibold text-gray-950">
                        {formatPrice(price)}
                    </span>

                    <span
                        className={`flex items-center gap-1.5 text-[11px] font-medium ${
                            inStock ? "text-emerald-800" : "text-gray-400"
                        }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                inStock ? "bg-emerald-800" : "bg-gray-300"
                            }`}
                        />
                        {inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                    <Link
                        to={`/products/${id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-50"
                    >
                        Подробнее
                    </Link>

                    <button
                        type="button"
                        disabled={!inStock}
                        className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-900 px-3 text-xs font-medium text-white transition-colors hover:bg-emerald-800 disabled:pointer-events-none disabled:opacity-50"
                    >
                        В корзину
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
