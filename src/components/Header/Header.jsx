import { Link } from "react-router-dom";
import Brand from "./Brand";
import Navigation from "./Navigation";
import HeaderActions from "./HeaderActions";

function Header() {
    return (
        <header className="site-header">
            <div className="header-announce">✳ &nbsp; С любовью печём каждый день &nbsp; · &nbsp; Свежая выпечка к вашему завтраку</div>
            <div className="site-header-inner">
                <Link to="/" aria-label="Тёплый хлеб — на главную"><Brand /></Link>
                <Navigation />
                <HeaderActions />
            </div>
        </header>
    );
}
export default Header;
