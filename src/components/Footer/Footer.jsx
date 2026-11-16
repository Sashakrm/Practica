import { Link } from "react-router-dom";
import Brand from "../Header/Brand";

function Footer() {
    return (
        <footer className="footer-bakery"><div className="container-wide">
            <div className="footer-main">
                <div className="footer-brand"><Link to="/"><Brand /></Link><p>Тёплый хлеб, нежная выпечка и немного счастья каждый день.</p><span className="footer-note">Сделано с любовью ✳</span></div>
                <div><h3>Навигация</h3><Link to="/">Главная</Link><Link to="/products">Каталог</Link><a href="/#about">О пекарне</a></div>
                <div><h3>Популярное</h3><Link to="/products?category=Хлеб">Наш хлеб</Link><Link to="/products?category=Выпечка">Свежая выпечка</Link><Link to="/products?category=Десерты">Десерты</Link></div>
                <div><h3>Учебный проект</h3><p>React + Vite</p><p>Mock Fetch API</p><p>Данные и корзина демонстрационные</p></div>
            </div>
            <div className="footer-bottom"><span>© 2026 «Тёплый хлеб». Учебный сайт хлебопекарни.</span><span>Здесь не принимаются реальные заказы</span></div>
        </div></footer>
    );
}
export default Footer;
