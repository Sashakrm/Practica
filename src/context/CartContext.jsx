import { useEffect, useState } from "react";
import { CartContext } from "./cartContextInstance";

const STORAGE_KEY = "teply-khleb-demo-cart";

function readCart() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readCart);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const add = (product) => {
        if (!product.inStock) return;
        setItems((old) => {
            const exists = old.find((item) => item.id === product.id);
            if (exists) return old.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...old, { id: product.id, name: product.name, price: product.price, photo: product.photo, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const changeQuantity = (id, delta) => setItems((old) => old
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0));
    const remove = (id) => setItems((old) => old.filter((item) => item.id !== id));
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const value = { items, isOpen, setIsOpen, add, changeQuantity, remove, count, total };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

