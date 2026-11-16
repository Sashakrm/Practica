import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import Queue_Panel from "./components/Queue/Queue_Panel";
import CartDrawer from "./components/Cart/CartDrawer";
import { CartProvider } from "./context/CartContext";

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<CatalogPage />} />
                        <Route path="/products/:id" element={<ProductPage />} />
                        <Route path="*" element={<CatalogPage />} />
                    </Routes>
                </Layout>
                <CartDrawer />
                <Queue_Panel />
            </CartProvider>
        </BrowserRouter>
    );
}
export default App;
