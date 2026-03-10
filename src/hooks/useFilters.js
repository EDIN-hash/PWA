/**
 * useFilters.js - Хук для управления фильтрацией и сортировкой данных
 * 
 * Реализация:
 * 1. Фильтрация по статусу (statusFilter):
 *    - 'all': все товары
 *    - 'na-stanie': товары в наличии (stan = 1)
 *    - 'wyjechalo': товары не в наличии (stan = 0)
 * 
 * 2. Фильтрация по действию (actionFilter) - для истории:
 *    - 'all': все записи
 *    - 'add': добавление товара
 *    - 'edit': редактирование товара
 *    - 'delete': удаление товара
 *    - 'view_category': просмотр категории
 * 
 * 3. Поиск (searchQuery):
 *    - Для обычных товаров: поиск по name, description, stoisko, размерам
 *    - Для истории: поиск по item_name
 * 
 * 4. Сортировка (sortConfig):
 *    - Поля: wysokosc, szerokosc, glebokosc, ilosc
 *    - Направление: asc (по возрастанию) / desc (по убыванию)
 *    - Для истории: сортировка по timestamp (новые first)
 * 
 * @see filters.js - константы фильтров
 * @see Controls.jsx - UI компонент фильтров
 */

import { useState, useMemo } from "react";
import { FILTERS, SORT_KEYS, SORT_DEFAULTS } from "../filters";

export function useFilters(items, selectedCategory = null) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: SORT_DEFAULTS.KEY, direction: SORT_DEFAULTS.DIRECTION });
    const [statusFilter, setStatusFilter] = useState(FILTERS.STATUS.ALL);
    const [actionFilter, setActionFilter] = useState(FILTERS.ACTION.ALL);

    const getNumericValue = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        const numericValue = typeof value === 'string' 
            ? parseFloat(value.replace(',', '.')) 
            : Number(value);
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const filteredItems = useMemo(() => {
        const itemsArray = Array.isArray(items) ? items : [];
        
        // Для истории не применяем фильтрацию по полю name
        const isHistoria = selectedCategory === 'Historia';
        
        const searchFiltered = itemsArray.filter((item) => {
            if (!item) return false;
            
            // Фильтрация по действию для истории
            if (isHistoria && actionFilter !== FILTERS.ACTION.ALL) {
                if (item.action !== actionFilter) return false;
            }
            
            // Для истории используем item_name, для обычных items - name
            const itemName = isHistoria ? item.item_name : item.name;
            
            if (!itemName) return false;
            
            if (!searchQuery) return true;
            
            const query = searchQuery.toLowerCase();
            const nameMatch = itemName.toLowerCase().includes(query);
            const descriptionMatch = (item.description || "").toLowerCase().includes(query);
            const stoiskoMatch = (item.stoisko || "").toLowerCase().includes(query);
            
            const dimensionsMatch = 
                (item.wysokosc && item.wysokosc.toString().includes(query)) ||
                (item.szerokosc && item.szerokosc.toString().includes(query)) ||
                (item.glebokosc && item.glebokosc.toString().includes(query));
            
            if (item.category === 'LADY') {
                return nameMatch || descriptionMatch || stoiskoMatch;
            }
            
            return nameMatch || descriptionMatch || dimensionsMatch;
        });
        
        const statusFiltered = searchFiltered.filter(item => {
            if (statusFilter === FILTERS.STATUS.ALL) return true;
            if (statusFilter === FILTERS.STATUS.NA_STANIE) return item.stan === 1 || item.stan === true;
            if (statusFilter === FILTERS.STATUS.WYJECHALO) return item.stan === 0 || item.stan === false || item.stan === null || item.stan === undefined;
            return true;
        });
        
        return [...statusFiltered].sort((a, b) => {
            if (!sortConfig.key) {
                // Для истории сортируем по timestamp
                if (isHistoria) {
                    const dateA = new Date(a.timestamp || 0);
                    const dateB = new Date(b.timestamp || 0);
                    return dateB - dateA; // новые first
                }
                // Для обычных items - по name
                return (a.name || '').localeCompare(b.name || '');
            }
            
            const aValue = getNumericValue(a[sortConfig.key]);
            const bValue = getNumericValue(b[sortConfig.key]);
            
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [items, searchQuery, sortConfig, statusFilter, selectedCategory, actionFilter]);

    const toggleSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === SORT_DEFAULTS.DIRECTION ? 'desc' : SORT_DEFAULTS.DIRECTION });
        } else {
            setSortConfig({ key, direction: SORT_DEFAULTS.DIRECTION });
        }
    };

    const resetSort = () => {
        setSortConfig({ key: SORT_DEFAULTS.KEY, direction: SORT_DEFAULTS.DIRECTION });
    };

    return {
        searchQuery,
        setSearchQuery,
        sortConfig,
        setSortConfig,
        statusFilter,
        setStatusFilter,
        actionFilter,
        setActionFilter,
        filteredItems,
        toggleSort,
        resetSort,
    };
}
