/**
 * README AI - Техническая документация для AI агентов
 * Inventory PWA v2.0
 * 
 * Содержит: структура файлов, изменения в коде, базы данных, API
 */

// ============================================================================
// СТРУКТУРА ПРОЕКТА
// ============================================================================

/*
src/
├── App.jsx              - Главный компонент, модальные окна, фильтрация
├── Card.jsx             - Компонент карточки товара с галереей для LADY
├── main.jsx             - Точка входа React
├── styles.css           - Основные стили (Tailwind + кастомные)
├── critical.css         - Критический CSS для FCP
├── neon-client.js       - Работа с БД Neon
├── device-utils.js      - Утилиты для генерации ID устройства
├── category-cards/      - Отдельные карточки по категориям (не используются)
│   ├── NMCard.jsx
│   ├── TelewizoryCard.jsx
│   └── ...
├── category-modals/     - Модальные окна (не используются)
└── components/
    └── LoginModal.jsx

vite.config.js           - Конфигурация Vite с оптимизациями
index.html               - HTML шаблон
package.json             - Зависимости
*/

// ============================================================================
// ОСНОВНЫЕ ИЗМЕНЕНИЯ В КОДЕ
// ============================================================================

/**
 * 1. LADY - Второе фото и галерея
 * --------------------------------
 * Файлы: Card.jsx, neon-client.js, App.jsx
 * 
 * - Добавлено поле photo_url2 в БД
 * - Карточка LADY показывает 2 фото с стрелочками
 * - Навигация: предыдущее/следующее фото
 * - Счётчик фото: "1 / 2"
 * 
 * Card.jsx:
 *   - getPhotos() - собирает массив фото
 *   - currentPhotoIndex - текущее фото
 *   - handlePrevPhoto/handleNextPhoto - навигация
 *   - LazyImage - ленивая загрузка
 */

// ============================================================================

/**
 * 2. Оптимизация изображений 720p
 * --------------------------------
 * Файл: Card.jsx
 * 
 * const MAX_IMAGE_WIDTH = 1280;
 * const MAX_IMAGE_HEIGHT = 720;
 * 
 * function optimizeImageUrl(url) {
 *     // Google Drive thumbnail API
 *     if (url.includes('drive.google.com')) {
 *         const fileIdMatch = url.match(/\/d\/([^/]+)/);
 *         if (fileIdMatch) {
 *             return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&width=1280&height=720`;
 *         }
 *     }
 *     // Другие URL с параметрами
 *     if (url.includes('?')) {
 *         return `${url}&w=1280&h=720`;
 *     }
 *     return url;
 * }
 */

// ============================================================================

/**
 * 3. Data Wyjazdu - текстовое поле DD.MM.RRRR
 * -------------------------------------------
 * Файлы: App.jsx, Card.jsx
 * 
 * - Убран DatePicker, добавлено текстовое поле
 * - Маска ввода: только цифры и точки
 * - Автоматическое добавление точек после ДД и ММ
 * - Формат: DD.MM.RRRR (напр. 03.03.2026)
 * 
 * App.jsx:
 *   <input type="text" 
 *     onChange={(e) => {
 *       let value = e.target.value.replace(/[^\d.]/g, '');
 *       if (value.length === 2 || value.length === 5) value += '.';
 *       if (value.length <= 10) setModalData({...});
 *     }}
 *     placeholder="DD.MM.RRRR"
 *     maxLength={10}
 *   />
 */

// ============================================================================

/**
 * 4. Опциональные поля (только ID обязателен)
 * -------------------------------------------
 * Файл: App.jsx
 * 
 * - Только name (ID) обязателен
 * - Все остальные поля могут быть пустыми
 * - При сохранении пустые строки → ''
 * - Числовые поля по умолчанию = 0
 * 
 * handleSaveItem():
 *   if (!modalData.name) {
 *     alert("ID (Name) jest wymagany!");
 *     return;
 *   }
 */

// ============================================================================

/**
 * 5. Lazy-load карточек и изображений
 * ------------------------------------
 * Файл: Card.jsx
 * 
 * - IntersectionObserver для карточек (rootMargin: 200px)
 * - Компонент LazyImage с IntersectionObserver (rootMargin: 100px)
 * - memo() для предотвращения лишних ре-рендеров
 * - loading="lazy" decoding="async"
 */

// ============================================================================

/**
 * 6. Поиск для LADY по stoisko
 * -----------------------------
 * Файл: App.jsx
 * 
 * const searchFilteredItems = itemsArray.filter(item => {
 *     const query = searchQuery.toLowerCase();
 *     const nameMatch = item.name.toLowerCase().includes(query);
 *     const descriptionMatch = item.description?.toLowerCase().includes(query);
 *     const stoiskoMatch = item.stoisko?.toLowerCase().includes(query);
 *     
 *     // Для LADY приоритетный поиск по stoisko
 *     if (item.category === 'LADY') {
 *         return nameMatch || descriptionMatch || stoiskoMatch;
 *     }
 *     
 *     return nameMatch || descriptionMatch;
 * });
 */

// ============================================================================

/**
 * 7. Vite Build Оптимизации
 * -------------------------
 * Файл: vite.config.js
 * 
 * - cssInjectedByJsPlugin - CSS в JS бандле
 * - cssCodeSplit: false - один CSS файл
 * - manualChunks: vendor чанк для react/react-dom/modal/datepicker
 * - Critical CSS инлайн в HTML
 */

// ============================================================================
// БАЗА ДАННЫХ - ТАБЛИЦА ITEMS
// ============================================================================

/*
Таблица: items

| Колонка        | Тип     | Описание                    |
|----------------|---------|----------------------------|
| name           | text    | ID товара (PRIMARY KEY)    |
| quantity       | text    | Разновидность              |
| ilosc          | int     | Количество                 |
| description    | text    | Описание                   |
| photo_url     | text    | Ссылка на фото 1          |
| photo_url2    | text    | Ссылка на фото 2 (NEW)    |
| category       | text    | Категория                  |
| wysokosc       | float   | Высота (см)                |
| szerokosc      | float   | Ширина (см)                |
| glebokosc      | float   | Глубина (см)               |
| data_wyjazdu  | text    | Дата выезда (DD.MM.RRRR)  |
| stan           | bool    | Наличие (1/0)              |
| linknadysk     | text    | Google Drive ссылка        |
| updatedAt      | timest  | Дата обновления            |
| updatedBy      | text    | Кто обновил                |
| deviceId       | text    | ID устройства              |
| stoisko        | text    | Номер стенда/витрины       |

Миграция для photo_url2:
  ALTER TABLE items ADD COLUMN photo_url2 TEXT DEFAULT '';
*/

// ============================================================================
// NEON CLIENT - МЕТОДЫ
// ============================================================================

/*
neon-client.js:

- getItems(category?)           - Получить все товары или по категории
- addItem(item)                 - Добавить товар
- updateItem(name, item)       - Обновить товар
- deleteItem(name)             - Удалить товар
- getNextAvailableId(category, tvSize) - Сгенерировать свободный ID
- registerUser(username, password, role) - Регистрация
- loginUser(username, password)         - Вход

Префиксы ID:
  Telewizory: TV{size}{number}  (напр. TV55001)
  Lodowki:    L{number}         (напр. L001)
  Ekspresy:   E{number}         (напр. E001)
  Krzesla:    K{number}         (напр. K001)
  LADY:       A{number}          (напр. A001)
  NM:         NM{number}         (напр. NM001)
*/

// ============================================================================
// КАТЕГОРИИ
// ============================================================================

/*
const categories = ["Telewizory", "Lodowki", "Ekspresy", "Krzesla", "NM", "LADY"];
*/

// ============================================================================
// CSS CLASSES
// ============================================================================

/*
Основные классы:
- .card-premium          - Карточка товара
- .card-image            - Изображение
- .badge-modern         - Бейдж категории/количества
- .tab-modern            - Табы категорий
- .modal-backdrop        - Подложка модального окна
- .loading-pulse         - Анимация загрузки
- .stoisko-section       - Блок с номером стенда
*/

// ============================================================================
// ТЕСТИРОВАНИЕ
// ============================================================================

/*
Команды:
  npm run dev          - Запуск dev сервера
  npm run build        - Билд для продакшена
  npm run analyze      - Анализ размера бандла
  npm run perf         - Замер FCP/LCP/TTI
*/

// ============================================================================
// КЛЮЧЕВЫЕ ФАЙЛЫ ДЛЯ AI
// ============================================================================

/*
При работе с кодом учитывай:
1. App.jsx          - основная логика, модальные окна, фильтрация
2. Card.jsx         - отображение карточек, галерея LADY
3. neon-client.js   - работа с БД
4. styles.css        - все стили
5. vite.config.js   - конфиг билда
*/

// ============================================================================
// ВЕРСИЯ
// ============================================================================

/*
v2.0 - Текущая версия
- Второе фото для LADY
- Оптимизация 720p
- Data Wyjazdu текстом
- Опциональные поля
- Lazy-load
- Оптимизации производительности
*/
