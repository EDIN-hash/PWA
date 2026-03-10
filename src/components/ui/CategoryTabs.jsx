import { getCategoriesForRole } from "../../constants/categories";

export default function CategoryTabs({ selectedCategory, onSelectCategory, currentUser }) {
    const visibleCategories = getCategoriesForRole(currentUser?.role);

    return (
        <div className="tabs-section pb-2">
            <div className="tabs-container flex flex-wrap gap-2 justify-center">
                {visibleCategories.map((category) => (
                    <button
                        key={category}
                        className={`tab-modern text-sm sm:text-base px-4 py-2 rounded-md ${selectedCategory === category ? "active" : ""} slide-in`}
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
