import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <nav aria-label="Основное меню" className="main-nav">
            <NavLink to="/" end className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Главная</NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Каталог</NavLink>
            <a className="nav-link" href="/#about">О пекарне</a>
        </nav>
    );
}
export default Navigation;
