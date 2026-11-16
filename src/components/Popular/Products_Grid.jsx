import ProductCard from "./ProductCard";
import { PRIORITY } from "../../api/request_queue";

function Products_Grid({ products, is_loading, error, on_retry, empty_text = "Ничего не найдено.", skeleton_count = 6 }) {
    if (is_loading) return <div className="products-grid">{Array.from({length: skeleton_count}, (_, i) => <div className="product-card skeleton-card" key={i}><div className="skeleton h-60"/><div className="p-5"><div className="skeleton h-4 w-20 mb-4"/><div className="skeleton h-7 w-3/4 mb-5"/><div className="skeleton h-8 w-1/3"/></div></div>)}</div>;
    if (error) return <div className="empty-state"><strong>Не удалось загрузить каталог</strong><p className="mt-2">{error}</p><button type="button" onClick={on_retry} className="btn-primary mt-5">Попробовать снова</button></div>;
    if (!products.length) return <div className="empty-state"><span aria-hidden="true" className="text-5xl">🥨</span><h3 className="font-display mt-3 text-2xl">Пока ничего не нашлось</h3><p className="mt-2">{empty_text}</p></div>;
    return <div className="products-grid">{products.map((product, index) => <ProductCard product={product} key={product.id} priority={index < 3 ? PRIORITY.HIGH : PRIORITY.NORMAL}/>)}</div>;
}
export default Products_Grid;
