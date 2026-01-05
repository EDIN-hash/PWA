import React from 'react';

export default function ItemCard({ item, role, onEdit, onDelete }) {
    return (
        <div className="item-card">
            <h3 className="font-bold">{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Status: {item.status}</p>
            {item.photo && <img src={item.photo} alt="item" className="w-32 h-32 object-cover mt-2" />}
            <p>{item.description}</p>
            {role === 'admin' && (
                <div className="flex gap-2 mt-2">
                    <button className="button-edit" onClick={() => onEdit(item)}>Edit</button>
                    <button className="button-delete" onClick={() => onDelete(item.id)}>Delete</button>
                </div>
            )}
        </div>
    );
}
