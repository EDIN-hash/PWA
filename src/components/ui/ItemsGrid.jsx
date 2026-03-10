import Card from "../../Card";
import HistoryCard from "../../HistoryCard";

export default function ItemsGrid({ items, isLoading, selectedCategory, editItem, deleteItem, role }) {
    console.log('ItemsGrid - items:', items, 'category:', selectedCategory);
    
    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="loading-pulse"></div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex justify-center py-8 text-white">
                No items found
            </div>
        );
    }

    return (
        <div className="items-grid grid-modern">
            {selectedCategory === 'Historia' ? (
                items.map((entry) => (
                    <HistoryCard key={entry.id} entry={entry} />
                ))
            ) : (
                items.map((item) => (
                    <Card
                        key={item.name}
                        item={item}
                        editItem={editItem}
                        deleteItem={deleteItem}
                        role={role}
                    />
                ))
            )}
        </div>
    );
}
