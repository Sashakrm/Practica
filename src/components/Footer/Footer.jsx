import { Link } from "react-router-dom";

const COLUMNS = [
    {
        title: "Каталог",
        links: [
            { label: "Все товары", to: "/products" },
            { label: "Новинки", to: "/products" },
            { label: "Скидки", to: "/products" },
        ],
    },
    {
        title: "Покупателям",
        links: [
            { label: "Корзина", to: "#" },
            { label: "Вход", to: "#" },
            { label: "Регистрация", to: "#" },
        ],
    },
    {
        title: "Магазин",
        links: [
            { label: "Админ-панель", to: "#" },
            { label: "Управление товарами", to: "#" },
            { label: "Категории", to: "#" },
        ],
    },
];

function Footer() {
    return (
        <footer className="mt-20 border-t border-gray-200 bg-white">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900 text-lg font-semibold text-white">
                            В
                        </span>
                        <span className="text-[15px] font-extrabold uppercase tracking-[0.16em] text-gray-950">
                            Витрина
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-500">
                        Учебный интернет-магазин: витрина, корзина и админ-панель с CRUD на React.
                    </p>
                </div>

                {COLUMNS.map((column) => (
                    <div key={column.title}>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                            {column.title}
                        </p>
                        <ul className="mt-4 space-y-3">
                            {column.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-gray-600 transition-colors hover:text-gray-950"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
                    <p>© 2026 Витрина. Учебный проект.</p>
                    <p>Дизайн-система: React · Tailwind CSS · React Router</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
