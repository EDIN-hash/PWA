/**
 * Controls.jsx - UI компонент панели управления фильтрами и сортировкой
 * 
 * Реализация фильтрации:
 * - Для категории "Historia": отображаются кнопки фильтрации по действиям
 *   (Dodano, Edytowano, Usunięto, Przeglądanie)
 * - Для остальных категорий: отображаются фильтры статуса (Na stanie, Wyjechało)
 *   и кнопки сортировки (Wysokość, Szerokość, Głębokość, Ilość)
 * 
 * Параметры:
 * - statusFilter: текущий фильтр статуса
 * - setStatusFilter: функция изменения фильтра статуса
 * - actionFilter: текущий фильтр действия (для истории)
 * - setActionFilter: функция изменения фильтра действия
 * - sortConfig: текущая конфигурация сортировки
 * - toggleSort: функция переключения сортировки по полю
 * - resetSort: функция сброса сортировки
 * - selectedCategory: текущая выбранная категория
 * 
 * @see filters.js - константы и стили фильтров
 * @see useFilters.js - логика фильтрации
 */

import { FILTERS, FILTER_LABELS, FILTER_STYLES } from "../../filters";

export default function Controls({
    statusFilter, 
    setStatusFilter, 
    sortConfig, 
    toggleSort, 
    resetSort,
    selectedCategory,
    actionFilter,
    setActionFilter
}) {
    const showSortControls = selectedCategory !== 'Historia';
    const showStatusFilters = selectedCategory !== 'Historia';
    const showActionFilters = selectedCategory === 'Historia';

    const actionFilters = [
        { value: FILTERS.ACTION.ALL, label: FILTER_LABELS.action.all },
        { value: FILTERS.ACTION.ADD, label: FILTER_LABELS.action.add, color: FILTER_STYLES.add },
        { value: FILTERS.ACTION.EDIT, label: FILTER_LABELS.action.edit, color: FILTER_STYLES.edit },
        { value: FILTERS.ACTION.DELETE, label: FILTER_LABELS.action.delete, color: FILTER_STYLES.delete },
        { value: FILTERS.ACTION.VIEW_CATEGORY, label: FILTER_LABELS.action.view_category, color: FILTER_STYLES.view_category },
    ];

    return (
        <div className="controls-section mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex flex-wrap gap-3 items-center justify-center">
                {showActionFilters && (
                    <div className="filter-group">
                        <span className="text-white text-sm font-medium mr-2">Akcja:</span>
                        {actionFilters.map((filter) => (
                            <button
                                key={filter.value}
                                className={`filter-btn ${actionFilter === filter.value ? 'active-filter' : ''} ${filter.color ? `${filter.color.bg} ${filter.color.border} ${filter.color.text}` : ''}`}
                                onClick={() => setActionFilter(filter.value)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                )}

                {showStatusFilters && (
                    <div className="filter-group">
                        <span className="text-white text-sm font-medium mr-2">Status:</span>
                        <button
                            className={`filter-btn ${statusFilter === FILTERS.STATUS.ALL ? 'active-filter' : ''}`}
                            onClick={() => setStatusFilter(FILTERS.STATUS.ALL)}
                        >
                            {FILTER_LABELS.status.all}
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === FILTERS.STATUS.NA_STANIE ? 'active-filter' : ''} bg-green-900/50 border-green-500/50 text-green-400`}
                            onClick={() => setStatusFilter(FILTERS.STATUS.NA_STANIE)}
                        >
                            {FILTER_LABELS.status[FILTERS.STATUS.NA_STANIE]}
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === FILTERS.STATUS.WYJECHALO ? 'active-filter' : ''} bg-red-900/50 border-red-500/50 text-red-400`}
                            onClick={() => setStatusFilter(FILTERS.STATUS.WYJECHALO)}
                        >
                            {FILTER_LABELS.status[FILTERS.STATUS.WYJECHALO]}
                        </button>
                    </div>
                )}

                {showSortControls && (
                    <div className="sort-group">
                        <span className="text-white text-sm font-medium mr-2">Sortuj:</span>
                        <button
                            className={`sort-btn ${sortConfig.key === 'wysokosc' ? 'active-sort' : ''}`}
                            onClick={() => toggleSort('wysokosc')}
                        >
                            Wysokość {sortConfig.key === 'wysokosc' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-btn ${sortConfig.key === 'szerokosc' ? 'active-sort' : ''}`}
                            onClick={() => toggleSort('szerokosc')}
                        >
                            Szerokość {sortConfig.key === 'szerokosc' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-btn ${sortConfig.key === 'glebokosc' ? 'active-sort' : ''}`}
                            onClick={() => toggleSort('glebokosc')}
                        >
                            Głębokość {sortConfig.key === 'glebokosc' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-btn ${sortConfig.key === 'ilosc' ? 'active-sort' : ''}`}
                            onClick={() => toggleSort('ilosc')}
                        >
                            Ilość {sortConfig.key === 'ilosc' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-btn ${sortConfig.key === null ? 'active-sort' : ''}`}
                            onClick={resetSort}
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
