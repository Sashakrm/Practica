const benefits = [
    { icon: "✳", heading: "Только из печи", text: "Каждое утро замешиваем тесто и печём небольшими партиями." },
    { icon: "♡", heading: "С любовью к деталям", text: "Используем настоящие ингредиенты и любимые рецепты." },
    { icon: "♧", heading: "Просто и натурально", text: "Вкус, который не нуждается в лишних добавках." },
];
function Benefits() {
    return (
        <section className="about-section" id="about"><div className="container-wide">
            <div className="about-intro"><span className="eyebrow">НАША ФИЛОСОФИЯ</span><h2 className="font-display">Каждая булочка — <em>маленькая история</em></h2><p>Мы верим, что хорошему дню иногда достаточно чашки кофе, ароматного хлеба и пары минут для себя.</p></div>
            <div className="benefits-grid">{benefits.map((benefit) => <div className="benefit" key={benefit.heading}><div className="benefit-icon" aria-hidden="true">{benefit.icon}</div><h3 className="font-display">{benefit.heading}</h3><p>{benefit.text}</p></div>)}</div>
        </div></section>
    );
}
export default Benefits;
