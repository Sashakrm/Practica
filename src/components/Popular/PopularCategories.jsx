import { Link } from "react-router-dom";
import { CATEGORY_ORDER, CATEGORY_DESCRIPTIONS, photoUrl } from "../../data/popular";
import { useProducts } from "../../hooks/useProducts";
import { PRIORITY } from "../../api/request_queue";
import Queued_Image from "./Queued_Image";

function PopularCategories() {
    const { all_products, is_loading, error, reload } = useProducts();
    const categoryNames = [...new Set(all_products.map((p) => p.category))];
    const categories = categoryNames.sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b))
        .map((name) => {
            const list = all_products.filter((p) => p.category === name);
            return { name, count: list.length, cover: list[0]?.photo };
        });

    return (
        <section className="section-cream" id="categories">
            <div className="container-wide section-space">
                <div className="section-heading">
                    <div><span className="eyebrow">НАШ АССОРТИМЕНТ</span><h2 className="font-display section-title">Что у нас <em>вкусного?</em></h2></div>
                    <p>От первого утреннего круассана до любимого пирога к вечернему чаю.</p>
                </div>
                {error ? <div className="empty-state"><p>{error}</p><button type="button" className="btn-outline mt-3" onClick={reload}>Повторить</button></div> :
                    <div className="category-grid">
                        {(is_loading ? CATEGORY_ORDER.map((name) => ({ name, count: 0 })) : categories).map((category, index) => (
                            is_loading ? <div key={category.name} className="category-tile skeleton" /> :
                            <Link key={category.name} className="category-tile" to={`/products?category=${encodeURIComponent(category.name)}`}>
                                <Queued_Image src={photoUrl(category.cover, 600)} alt={category.name} label={`Категория: ${category.name}`} priority={index < 2 ? PRIORITY.NORMAL : PRIORITY.LOW} img_class_name="category-image" />
                                <span className="category-gradient" />
                                <span className="category-index">0{index + 1} / 0{categories.length}</span>
                                <span className="category-details"><strong className="font-display">{category.name}</strong><small>{CATEGORY_DESCRIPTIONS[category.name] || `${category.count} товаров`}</small></span>
                                <span className="category-arrow">↗</span>
                            </Link>
                        ))}
                    </div>
                }
            </div>
        </section>
    );
}
export default PopularCategories;
