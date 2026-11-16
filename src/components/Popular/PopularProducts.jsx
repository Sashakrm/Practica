import { Link } from "react-router-dom";
import Products_Grid from "./Products_Grid";
import { useProducts } from "../../hooks/useProducts";

function PopularProducts() {
    const { products, is_loading, error, reload } = useProducts({ popular_only: true, limit: 6 });
    return (
        <section className="section-products" id="favorites">
            <div className="container-wide section-space">
                <div className="section-heading">
                    <div><span className="eyebrow">ПОПРОБУЙТЕ ПЕРВЫМИ</span><h2 className="font-display section-title">Ваши <em>любимчики</em></h2></div>
                    <Link className="text-link" to="/products">Смотреть всё меню <span>↗</span></Link>
                </div>
                <Products_Grid products={products} is_loading={is_loading} error={error} on_retry={reload} empty_text="Скоро появятся свежие товары." />
            </div>
        </section>
    );
}
export default PopularProducts;
