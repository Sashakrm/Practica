import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { categoryCounts, filterProducts } from "../src/utils/catalogFilters.js";

const products = JSON.parse(readFileSync(new URL("../public/api/products.json", import.meta.url), "utf8"));

test("Демо-каталог содержит валидные уникальные товары", () => {
    assert.equal(products.length, 18);
    assert.equal(new Set(products.map((p) => p.id)).size, products.length);
    assert.equal(new Set(products.map((p) => p.category)).size, 5);
    assert.ok(products.every((p) => p.name && p.ingredients && Number.isFinite(p.price)));
});
test("Поиск ищет и в названии, и в составе", () => {
    const byName = filterProducts(products, { search: "Круассан" });
    assert.ok(byName.length >= 2);
    assert.ok(byName.some((p) => p.name.includes("Круассан")));
    assert.ok(filterProducts(products, { search: "закваска" }).length >= 2);
});
test("Фильтры категории, наличия, цены и сладкого комбинируются", () => {
    const result = filterProducts(products, { category: "Выпечка", in_stock: true, sweet_only: true, max_price: 70 });
    assert.ok(result.length >= 2);
    assert.ok(result.every((p) => p.category === "Выпечка" && p.inStock && p.sweet && p.price <= 70));
});
test("Сортировка и лимит работают", () => {
    const result = filterProducts(products, { sort: "price-asc", limit: 3 });
    assert.equal(result.length, 3);
    assert.deepEqual(result.map((p) => p.price), [...result.map((p) => p.price)].sort((a, b) => a - b));
});
test("Фасеты динамически пересчитывают категории", () => {
    const facets = categoryCounts(products, { in_stock: true, max_price: 65 });
    assert.equal(facets.all, filterProducts(products, { in_stock: true, max_price: 65 }).length);
    assert.equal(Object.values(facets.byCategory).reduce((a, b) => a + b, 0), facets.all);
});
