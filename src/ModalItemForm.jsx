import React, { useState, useEffect } from "react";

export default function ModalItemForm({ item, onSave, onClose }) {
    const [name, setName] = useState("");
    const [ilosc, setIlosc] = useState(0);
    const [photo_url, setPhotoUrl] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (item) {
            setName(item.name || "");
            setIlosc(item.ilosc || 0);
            setPhotoUrl(item.photo_url || "");
            setDescription(item.description || "");
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, ilosc, photo_url, description });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{item ? "Edit Item" : "Add Item"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="input input-bordered" required />
                    <input type="number" placeholder="Ilość" value={ilosc} onChange={e => setIlosc(parseInt(e.target.value))} className="input input-bordered" required />
                    <input type="text" placeholder="Photo URL" value={photo_url} onChange={e => setPhotoUrl(e.target.value)} className="input input-bordered" />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="textarea textarea-bordered" />
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
