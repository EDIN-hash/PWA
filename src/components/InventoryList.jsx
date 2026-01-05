import { useEffect, useState } from "react";
import TileCard from "./TileCard";

export default function InventoryList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then(res => res.json())
            .then(setItems);
    }, []);

    return (
        <div className="flex flex-wrap">
            {items.map(item => <TileCard key={item.id} item={item} />)}
        </div>
    )
}
