// Слой API-запросов. Каждый запрос — задача в приоритетной очереди.
// GET — fetch локального JSON-файла (mock endpoint), мутации — «БД в памяти».

import { PRIORITY, request_queue } from "./request_queue";
import { filterProducts } from "../utils/catalogFilters";

const API_URL = "/api/products.json";
let db_cache = null;
let db_size = 0;
let db_promise = null; // один общий fetch на всё приложение

function load_db(signal, report) {
    if (db_cache) {
        report(1, db_size);
        return Promise.resolve(db_cache);
    }
    if (!db_promise) {
        // fetch без signal намеренно: отмена одной задачи не должна убивать
        // общую загрузку, нужную другим компонентам
        db_promise = fetch(API_URL)
            .then(async (response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const text = await response.text();
                db_size = text.length;
                db_cache = JSON.parse(text);
                return db_cache;
            })
            .catch((error) => {
                db_promise = null; // разрешаем повторить после ошибки
                throw error;
            });
    }
    return db_promise.then((db) => {
        report(1, db_size);
        return db;
    });
}

// GET /api/products?category=&search=&in_stock=&sort=&limit=
export function fetch_products(params = {}, { signal } = {}) {
    const { category = "", search = "", in_stock = false, sort = "default", limit, min_price, max_price, sweet_only = false } = params;
    const parts = [];
    if (category) parts.push(`category=${category}`);
    if (search.trim()) parts.push(`search=${search.trim()}`);
    if (in_stock) parts.push("in_stock=1");
    if (sort !== "default") parts.push(`sort=${sort}`);
    if (limit) parts.push(`limit=${limit}`);
    if (min_price !== undefined) parts.push(`min_price=${min_price}`);
    if (max_price !== undefined) parts.push(`max_price=${max_price}`);
    if (sweet_only) parts.push("sweet_only=1");

    return request_queue.add({
        label: `GET /api/products${parts.length ? "?" + parts.join("&") : ""}`,
        url: API_URL,
        kind: "data",
        priority: PRIORITY.CRITICAL,
        signal,
        run: async (task_signal, report) => {
            const db = await load_db(task_signal, report);
            return filterProducts(db, { category, search, in_stock, sort, limit, min_price, max_price, sweet_only })
                .map((product) => ({ ...product }));
        },
    }).promise;
}

// GET /api/products/:id
export function fetch_product_by_id(id, { signal } = {}) {
    return request_queue.add({
        label: `GET /api/products/${String(id).slice(0, 8)}…`,
        url: API_URL,
        kind: "data",
        priority: PRIORITY.HIGH,
        signal,
        run: async (task_signal, report) => {
            const db = await load_db(task_signal, report);
            const product = db.find((p) => String(p.id) === String(id));
            if (!product) throw new Error("Товар не найден (404)");
            return { ...product };
        },
    }).promise;
}

// POST /api/products
export function create_product(data) {
    return request_queue.add({
        label: "POST /api/products",
        url: API_URL,
        kind: "data",
        priority: PRIORITY.HIGH,
        run: async (signal, report) => {
            const db = await load_db(signal, report);
            const new_product = {
                id: crypto.randomUUID(),
                name: data.name ?? "Без названия",
                category: data.category ?? "Хлеб",
                price: Number(data.price) || 0,
                inStock: data.inStock ?? true,
                photo: data.photo ?? "photo-1509440159596-0249088772ff",
            };
            db.push(new_product);
            return { ...new_product };
        },
    }).promise;
}

// PATCH /api/products/:id
export function update_product(id, patch) {
    return request_queue.add({
        label: `PATCH /api/products/${String(id).slice(0, 8)}…`,
        url: API_URL,
        kind: "data",
        priority: PRIORITY.HIGH,
        run: async (signal, report) => {
            const db = await load_db(signal, report);
            const index = db.findIndex((p) => String(p.id) === String(id));
            if (index === -1) throw new Error("Товар не найден (404)");
            db[index] = { ...db[index], ...patch, id };
            return { ...db[index] };
        },
    }).promise;
}

// DELETE /api/products/:id
export function delete_product(id) {
    return request_queue.add({
        label: `DELETE /api/products/${String(id).slice(0, 8)}…`,
        url: API_URL,
        kind: "data",
        priority: PRIORITY.HIGH,
        run: async (signal, report) => {
            const db = await load_db(signal, report);
            const index = db.findIndex((p) => String(p.id) === String(id));
            if (index === -1) throw new Error("Товар не найден (404)");
            db.splice(index, 1);
            return { success: true };
        },
    }).promise;
}