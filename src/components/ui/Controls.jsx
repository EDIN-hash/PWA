export default function Controls({ 
    statusFilter, 
    setStatusFilter, 
    sortConfig, 
    toggleSort, 
    resetSort,
    selectedCategory 
}) {
    const showSortControls = selectedCategory !== 'Historia';

    return (
        <div className="controls-section mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex flex-wrap gap-3 items-center justify-center">
                <div className="filter-group">
                    <span className="text-white text-sm font-medium mr-2">Status:</span>
                    <button
                        className={`filter-btn ${statusFilter === 'all' ? 'active-filter' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        Wszystkie
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'na-stanie' ? 'active-filter' : ''} bg-green-900/50 border-green-500/50 text-green-400`}
                        onClick={() => setStatusFilter('na-stanie')}
                    >
                        Na stanie
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'wyjechalo' ? 'active-filter' : ''} bg-red-900/50 border-red-500/50 text-red-400`}
                        onClick={() => setStatusFilter('wyjechalo')}
                    >
                        Wyjechało
                    </button>
                </div>

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
