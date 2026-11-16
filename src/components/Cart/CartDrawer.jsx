import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { formatPrice, photoUrl } from "../../data/popular";

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, changeQuantity, remove, total } = useCart();
    const [demoNotice, setDemoNotice] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (event) => { if (event.key === "Escape") setIsOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;
    return (
        <div className="cart-layer" role="presentation">
            <button type="button" className="cart-backdrop" aria-label="Закрыть корзину" onClick={() => setIsOpen(false)} />
            <section className="cart-drawer" role="dialog" aria-modal="true" aria-label="Корзина">
                <div className="flex items-center justify-between border-b border-[#eaded1] px-6 py-5">
                    <div><p className="eyebrow">Ваша покупка</p><h2 className="font-display text-3xl">Корзина</h2></div>
                    <button type="button" onClick={() => setIsOpen(false)} className="icon-round" aria-label="Закрыть">×</button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {items.length === 0 ? (
                        <div className="py-14 text-center">
                            <span className="text-6xl" aria-hidden="true">🥐</span>
                            <p className="font-display mt-5 text-2xl">Здесь пока пусто</p>
                            <p className="mt-2 text-sm text-[#776657]">Добавьте свежую выпечку из каталога.</p>
                            <Link onClick={() => setIsOpen(false)} className="btn-primary mt-6 inline-flex" to="/products">В каталог →</Link>
                        </div>
                    ) : items.map((item) => (
                        <div className="flex gap-4 border-b border-[#eee4d9] py-5" key={item.id}>
                            <img className="h-20 w-20 rounded-xl object-cover" src={photoUrl(item.photo, 200)} alt="" />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium leading-snug text-[#38281e]">{item.name}</p>
                                <p className="mt-1 text-sm text-[#a36a44]">{formatPrice(item.price)}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="quantity-stepper">
                                        <button type="button" aria-label="Уменьшить количество" onClick={() => changeQuantity(item.id, -1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button type="button" aria-label="Увеличить количество" onClick={() => changeQuantity(item.id, 1)}>+</button>
                                    </div>
                                    <button type="button" className="text-xs underline text-[#907e6f]" onClick={() => remove(item.id)}>Убрать</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {items.length > 0 && (
                    <div className="border-t border-[#eaded1] p-6">
                        <div className="mb-4 flex justify-between text-lg font-semibold"><span>Итого</span><span>{formatPrice(total)}</span></div>
                        <button type="button" className="btn-primary w-full" onClick={() => setDemoNotice(true)}>Оформить заказ</button>
                        {demoNotice && <p role="status" className="mt-3 text-center text-sm text-[#98603d]">Это учебный сайт. Оформление заказа — демонстрация, оплаты нет.</p>}
                        <p className="mt-3 text-center text-xs text-[#928174]">Демонстрационная корзина, без реальных покупок</p>
                    </div>
                )}
            </section>
        </div>
    );
}
