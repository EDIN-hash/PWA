/**
 * Фильтрация и сортировка данных
 * 
 * Реализация:
 * 1. useFilters.js - хук для управления фильтрацией:
 *    - statusFilter: фильтрация по наличию (na-stanie, wyjechalo)
 *    - actionFilter: фильтрация по действию в истории (add, edit, delete, view_category)
 *    - searchQuery: поиск по названию/описанию
 *    - sortConfig: сортировка по полям (wysokosc, szerokosc, glebokosc, ilosc)
 * 
 * 2. Controls.jsx - UI компонент для отображения фильтров:
 *    - Для обычных категорий: фильтры статуса + сортировка
 *    - Для истории: фильтры по действию (Dodano, Edytowano, Usunięto, Przeglądanie)
 * 
 * 3. Интеграция с категориями:
 *    - Historia: только фильтры по действию, без статуса и сортировки
 *    - Другие категории: фильтры статуса + сортировка
 */

export const FILTERS = {
    STATUS: {
        ALL: 'all',
        NA_STANIE: 'na-stanie',
        WYJECHALO: 'wyjechalo',
    },
    ACTION: {
        ALL: 'all',
        ADD: 'add',
        EDIT: 'edit',
        DELETE: 'delete',
        VIEW_CATEGORY: 'view_category',
    },
};

export const FILTER_LABELS = {
    status: {
        all: 'Wszystkie',
        'na-stanie': 'Na stanie',
        wyjechalo: 'Wyjechało',
    },
    action: {
        all: 'Wszystkie',
        add: 'Dodano',
        edit: 'Edytowano',
        delete: 'Usunięto',
        view_category: 'Przeglądanie',
    },
};

export const FILTER_STYLES = {
    add: { bg: 'bg-green-900/50', border: 'border-green-500/50', text: 'text-green-400' },
    edit: { bg: 'bg-blue-900/50', border: 'border-blue-500/50', text: 'text-blue-400' },
    delete: { bg: 'bg-red-900/50', border: 'border-red-500/50', text: 'text-red-400' },
    view_category: { bg: 'bg-yellow-900/50', border: 'border-yellow-500/50', text: 'text-yellow-400' },
};

export const SORT_KEYS = {
    WYSOKOSC: 'wysokosc',
    SZEROKOSC: 'szerokosc',
    GLEBOKOSC: 'glebokosc',
    ILOSC: 'ilosc',
};

export const SORT_DEFAULTS = {
    KEY: null,
    DIRECTION: 'asc',
};

export default FILTERS;
