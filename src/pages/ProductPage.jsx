import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetch_product_by_id } from "../api/products_api";
import { formatPrice, photoUrl } from "../data/popular";
import { PRIORITY } from "../api/request_queue";
import Queued_Image from "../components/Popular/Queued_Image";
import { useCart } from "../context/useCart";

function ProductPage() {
    const { id } = useParams();
    const { add } = useCart();
    const [product, set_product] = useState(null);
    const [is_loading, set_is_loading] = useState(true);
    const [error, set_error] = useState(null);
    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        fetch_product_by_id(id, { signal: controller.signal })
            .then((data) => { if (active) { set_product(data); set_error(null); set_is_loading(false); } })
            .catch((err) => { if (active && err?.name !== "AbortError") { set_error(err.message); set_is_loading(false); } });
        return () => { active = false; controller.abort(); };
    }, [id]);
    return (
        <section className="product-page container-wide">
            <Link to="/products" className="back-link">← &nbsp; Вернуться в каталог</Link>
            {is_loading ? <div className="product-detail-layout"><div className="skeleton rounded-2xl aspect-square"/><div className="skeleton rounded-2xl h-80"/></div> : error || !product ? <div className="empty-state"><h2 className="font-display text-2xl">Товар не найден</h2><p>{error}</p><Link className="btn-primary mt-4 inline-flex" to="/products">Вернуться в каталог</Link></div> :
                <div className="product-detail-layout">
                    <div className="product-detail-photo"><Queued_Image src={photoUrl(product.photo, 1100)} alt={product.name} label={product.name} priority={PRIORITY.HIGH}/>{product.isNew && <span className="product-badge">Новинка</span>}</div>
                    <div className="product-detail-info">
                        <span className="eyebrow">{product.category} · {product.weight} г</span>
                        <h1 className="font-display">{product.name}</h1>
                        <p className="product-description">{product.description}</p>
                        <p className="detail-price">{formatPrice(product.price)}</p>
                        <p className={`stock-info ${product.inStock ? "" : "sold-out"}`}><span/> {product.inStock ? "В наличии · свежее сегодня" : "Сегодня раскупили"}</p>
                        <button className="btn-primary detail-add" type="button" disabled={!product.inStock} onClick={() => add(product)}>{product.inStock ? "Добавить в корзину ↗" : "Нет в наличии"}</button>
                        <div className="ingredients"><h2 className="font-display">Состав</h2><p>{product.ingredients}</p></div>
                        <p className="detail-notice">✳ Данные демонстрационные. Оплата и доставка не подключены.</p>
                    </div>
                </div>
            }
        </section>
    );
}
export default ProductPage;
