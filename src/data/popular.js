// Данные скопированы со страницы каталога (сохранённый /products).
// Фото — Unsplash, id взяты из разметки страницы.

export const CATEGORY_ORDER = ["Одежда", "Спорт", "Электроника", "Дом"];

export const products = [
    {
        id: "6ae4a4afcaa5e68c64286c86",
        name: "Беспроводные наушники Aurora",
        category: "Электроника",
        price: 12990,
        inStock: true,
        photo: "photo-1505740420928-5e560c06d30e",
    },
    {
        id: "6ae4a4afcaa5e68c64286c87",
        name: "Смарт-часы Pulse 2",
        category: "Электроника",
        price: 16990,
        inStock: true,
        photo: "photo-1546868871-7041f2a55e12",
    },
    {
        id: "6ae4a4afcaa5e68c64286c88",
        name: "Портативная колонка Nomad",
        category: "Электроника",
        price: 6490,
        inStock: false,
        photo: "photo-1608043152269-423dbba4e7e1",
    },
    {
        id: "6ae4a4afcaa5e68c64286c89",
        name: "Футболка Basic Cotton",
        category: "Одежда",
        price: 1990,
        inStock: true,
        photo: "photo-1521572163474-6864f9cf17ab",
    },
    {
        id: "6ae4a4afcaa5e68c64286c8a",
        name: "Джинсы Straight Denim",
        category: "Одежда",
        price: 5990,
        inStock: true,
        photo: "photo-1542272604-787c3835535d",
    },
    {
        id: "6ae4a4afcaa5e68c64286c8b",
        name: "Настольная лампа Linea",
        category: "Дом",
        price: 4990,
        inStock: true,
        photo: "photo-1507473885765-e6ed057f782c",
    },
    {
        id: "6ae4a4afcaa5e68c64286c8c",
        name: "Ваза Ceramic Sand",
        category: "Дом",
        price: 3490,
        inStock: true,
        photo: "photo-1578749556568-bc2c40e68b61",
    },
    {
        id: "6ae4a4afcaa5e68c64286c8d",
        name: "Кроссовки Runner Pro",
        category: "Спорт",
        price: 8490,
        inStock: true,
        photo: "photo-1542291026-7eec264c27ff",
    },
    {
        id: "6ae4a4afcaa5e68c64286c8e",
        name: "Коврик для йоги Flow",
        category: "Спорт",
        price: 2790,
        inStock: true,
        photo: "photo-1592432678016-e910b452f9a2",
    },
];

export function photoUrl(photo, width = 800) {
    return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=80`;
}

export function formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
}
