import { useCart } from "../../context/useCart";

function CartAction() {
    const { count, setIsOpen } = useCart();
    return (
        <button className="header-cart" type="button" onClick={() => setIsOpen(true)} aria-label={`Открыть корзину, товаров: ${count}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
            <span className="cart-text">Корзина</span><span className="cart-count">{count}</span>
        </button>
    );
}
export default CartAction;
