import { Link } from "react-router-dom";
import { formatPrice, photoUrl } from "../../data/popular";
import { PRIORITY } from "../../api/request_queue";
import { useCart } from "../../context/useCart";
import Queued_Image from "./Queued_Image";

function ProductCard({ product, priority = PRIORITY.NORMAL }) {
    const { add } = useCart();
    const { id, name, category, price, weight, inStock, photo, isNew } = product;
    return (
        <article className="product-card">
            <Link to={`/products/${id}`} className="product-card-image group" aria-label={`Подробнее: ${name}`}>
                <Queued_Image src={photoUrl(photo)} alt={name} label={name} priority={priority} img_class_name="transition-transform duration-500 group-hover:scale-105" />
                {isNew && <span className="product-badge">Новинка</span>}
                {!inStock && <span className="product-badge muted">Раскупили</span>}
                <span className="product-image-arrow">↗</span>
            </Link>
            <div className="product-card-body">
                <div className="product-card-meta"><span>{category}</span><span>{weight} г</span></div>
                <h3 className="font-display product-card-name"><Link to={`/products/${id}`}>{name}</Link></h3>
                <div className="product-card-bottom">
                    <strong className="price">{formatPrice(price)}</strong>
                    <button type="button" disabled={!inStock} className="add-button" onClick={() => add(product)} aria-label={`Добавить ${name} в корзину`}>{inStock ? "+" : "×"}</button>
                </div>
            </div>
        </article>
    );
}
export default ProductCard;
