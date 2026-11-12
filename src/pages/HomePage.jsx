import Hero from "../components/Hero/Hero";
import PopularCategories from "../components/Popular/PopularCategories";
import PopularProducts from "../components/Popular/PopularProducts";
import Benefits from "../components/Benefits/Benefits";

function HomePage() {
    return (
        <div>
            <Hero />
            <PopularCategories />
            <PopularProducts />
            <Benefits />
        </div>
    );
}

export default HomePage;
