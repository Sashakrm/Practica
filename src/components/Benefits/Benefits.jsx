const BENEFITS = [
    {
        title: "Доставка 1–3 дня",
        text: "По всему ПМР, бесплатно от 50 ₽",
        icon: (
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m13 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14m-4 9h6m-7 0a2 2 0 1 1-4 0m14 0a2 2 0 1 1-4 0" />
        ),
    },
    {
        title: "Гарантия качества",
        text: "Проверяем каждую партию товара",
        icon: (
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-3-10l2 2 4-4" />
        ),
    },
    {
        title: "Возврат 30 дней",
        text: "Без вопросов и лишних формальностей",
        icon: (
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" />
        ),
    },
];

function Benefits() {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid grid-cols-1 gap-8 rounded-2xl border border-gray-200 bg-white p-8 md:grid-cols-3">
                    {BENEFITS.map((item) => (
                        <div key={item.title} className="flex items-start gap-4">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mt-1 h-6 w-6 shrink-0 text-emerald-900"
                                aria-hidden="true"
                            >
                                {item.icon}
                            </svg>

                            <div>
                                <p className="text-base font-semibold text-gray-950">{item.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Benefits;
