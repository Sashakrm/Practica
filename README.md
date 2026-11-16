# Тёплый хлеб — учебный сайт хлебопекарни

Готовый учебный проект **React 19 + Vite 8 + React Router + Tailwind CSS 4**.

## Запуск

Нужен Node.js 22+.

```bash
npm install
npm run dev
```

Откройте адрес, который напечатает Vite (обычно `http://localhost:5173`).

Проверка проекта:

```bash
npm test
npm run lint
npm run build
npm run preview
```

В архив включена также готовая production-сборка в папке `dist/`. Для её открытия нужен HTTP-сервер (`npm run preview`), а не прямое открытие `index.html` из файлового менеджера.

## Темы практики

| Тема | Реализация |
|---|---|
| Dynamic Load Products | JSON-каталог загружается динамически при монтировании страниц, показываются состояния loading / error / empty. |
| Write Fetch API Queries | `src/api/products_api.js`: GET коллекции и товара по id; имитация POST/PATCH/DELETE и обработка параметров запросов. |
| Load Data in React Comp | `src/hooks/useProducts.js` + `src/api/products_store.js`: общий стор, подписка React и загрузка данных. |
| Search in Catalog (useState) | Поиск по названию, описанию и составу в `src/pages/CatalogPage.jsx`; поле управляется состоянием React. |
| Release Filter by Categories | Фильтрация по категориям и счётчики товаров. |
| Release filters by oth params | Цена, наличие, сладкое, новинки, сортировка, комбинации фильтров. |
| Adaptive Catalogs & Filters | Категории строятся из полученного JSON, счётчики меняются при других фильтрах, интерфейс адаптивен; параметры сохраняются в адресной строке. |

## Fake API

**Реального сервера API и базы данных нет.**

- `public/api/products.json` содержит 18 вымышленных товаров пяти категорий: Хлеб, Выпечка, Десерты, Пироги, Напитки.
- `fetch('/api/products.json')` делает реальный браузерный запрос только к **локальному статическому JSON** — это заглушка получения данных.
- `fetch_products({ category, search, in_stock, sort, min_price, max_price, sweet_only, limit })` имитирует GET с параметрами. Фильтрация выполняется локально, без backend.
- `fetch_product_by_id(id)` имитирует GET одного товара.
- `create_product`, `update_product`, `delete_product` работают только с временным массивом в памяти и сбрасываются при перезагрузке.
- `src/utils/catalogFilters.js` содержит общую реализацию фильтрации mock API и React.
- Фотографии загружаются по внешним адресам Unsplash и требуют интернета; если фото недоступно, появляется локальная иллюстрация.

## Интерфейс

- `/` — главная, категории, популярная выпечка, блок о пекарне.
- `/products` — каталог с поиском и комбинированными фильтрами.
- `/products/:id` — карточка товара.
- Корзина имитирует добавление, удаление и изменение количества, хранится в `localStorage`; **покупки и оплата не работают**.
- Панель «Очередь» в нижнем углу — сохранённый механизм учебной демонстрации загрузок. Можно свернуть или развернуть, менять симулируемую скорость сети.

## Тестирование

В `tests/catalog.test.mjs` — проверки уникальности товаров, поиска, объединения фильтров, сортировки и динамических счётчиков.

## Структура

```text
public/api/products.json         mock-данные
src/api/products_api.js          mock fetch API
src/api/products_store.js        общий стор данных
src/api/request_queue.js         очередь запросов
src/hooks/useProducts.js         React-хук для каталога
src/utils/catalogFilters.js      логика поиска/фильтрации
src/pages/                    главная, каталог, товар
src/components/               UI, карточки, корзина, очередь
src/context/                  корзина и localStorage
tests/                        автоматические тесты
```
