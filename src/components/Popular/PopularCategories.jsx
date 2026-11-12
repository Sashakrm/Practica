import { Link } from "react-router-dom";
import { CATEGORY_ORDER, photoUrl, products } from "../../data/popular";

function PopularCategories() {
    const categories = CATEGORY_ORDER.map((name) => {
        const inCategory = products.filter((p) => p.category === name);
        return {
            name,
            count: inCategory.length,
            cover: inCategory[0]?.photo,
        };
    });

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                        Категории
                    </p>
                    <h2 className="text-3xl font-medium tracking-tight text-gray-950">
                        Популярные категории
                    </h2>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/products?category=${encodeURIComponent(category.name)}`}
                            className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100"
                        >
                            {category.cover && (
                                <img
                                    src={photoUrl(category.cover, 600)}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="text-base font-semibold">{category.name}</p>
                                <p className="text-xs text-white/80">
                                    Товаров: {category.count}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularCategories;
