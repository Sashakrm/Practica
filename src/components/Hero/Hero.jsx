import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { photoUrl } from "../../data/popular";

function Hero() {
    const { all_products, is_loading } = useProducts();
    return (
        <section className="hero-bakery">
            <div className="container-wide hero-inner">
                <div className="hero-copy">
                    <span className="hero-kicker"><span className="tiny-sun">✳</span> СВЕЖЕЕ КАЖДОЕ УТРО</span>
                    <h1 className="font-display hero-title">Счастье пахнет <em>свежим хлебом</em></h1>
                    <p className="hero-description">Готовим с душой, печём с любовью. Хрустящий хлеб, нежные круассаны и домашние десерты — маленький повод сделать день лучше.</p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn-primary">Выбрать выпечку <span>↗</span></Link>
                        <a href="#about" className="btn-outline">Наша история <span>↗</span></a>
                    </div>
                    <div className="hero-points">
                        <span><b>✳</b> Натуральные ингредиенты</span>
                        <span><b>✳</b> Выпекаем ежедневно</span>
                    </div>
                </div>
                <div className="hero-photo-wrap">
                    <img className="hero-photo" src={photoUrl("photo-1509440159596-0249088772ff", 1400)} alt="Свежевыпеченный ремесленный хлеб" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/bakery-placeholder.svg"; }} />
                    <div className="hero-stamp"><span>✳</span><strong>из печи</strong><small>с любовью</small></div>
                    <div className="hero-float"><span className="hero-float-icon">🥐</span><span><b>{is_loading ? "..." : all_products.length} вкусных поводов</b><small>заглянуть к нам сегодня</small></span></div>
                </div>
            </div>
            <div className="hero-bottom-deco">✳ &nbsp; ХЛЕБ, КОТОРЫЙ ОБЪЕДИНЯЕТ &nbsp; ✳ &nbsp; МАЛЕНЬКИЕ РАДОСТИ КАЖДЫЙ ДЕНЬ &nbsp; ✳</div>
        </section>
    );
}
export default Hero;
