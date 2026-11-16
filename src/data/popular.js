// Единые настройки витрины. Категории берутся из ответа mock API.
export const CATEGORY_ORDER = ["Хлеб", "Выпечка", "Десерты", "Пироги", "Напитки"];
export const CATEGORY_DESCRIPTIONS = {
    "Хлеб": "Ремесленный хлеб на каждый день",
    "Выпечка": "Круассаны, булочки и слойки",
    "Десерты": "Небольшие сладкие радости",
    "Пироги": "Домашние рецепты с начинкой",
    "Напитки": "Для идеальной пары к выпечке",
};

export function photoUrl(photo, width = 800) {
    if (!photo) return "/favicon.svg";
    if (photo.startsWith("/")) return photo;
    return `https://images.unsplash.com/${encodeURIComponent(photo)}?auto=format&fit=crop&w=${width}&q=80`;
}

export function formatPrice(value) {
    return `${Number(value).toLocaleString("ru-RU")} ₽`;
}
