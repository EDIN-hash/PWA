import { useState, useMemo } from "react";

export function useFilters(items, selectedCategory = null) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [statusFilter, setStatusFilter] = useState('all');

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
            if (statusFilter === 'all') return true;
            if (statusFilter === 'na-stanie') return item.stan === 1 || item.stan === true;
            if (statusFilter === 'wyjechalo') return item.stan === 0 || item.stan === false || item.stan === null || item.stan === undefined;
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
    }, [items, searchQuery, sortConfig, statusFilter, selectedCategory]);

    const toggleSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };

    const resetSort = () => {
        setSortConfig({ key: null, direction: 'asc' });
    };

    return {
        searchQuery,
        setSearchQuery,
        sortConfig,
        setSortConfig,
        statusFilter,
        setStatusFilter,
        filteredItems,
        toggleSort,
        resetSort,
    };
}
