import React from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function LodowkiModal({ 
    isOpen, 
    onRequestClose, 
    modalData, 
    setModalData, 
    handleSaveItem, 
    editingItem 
}) {
    
    const categories = ["Telewizory", "Lodowki", "Ekspresy", "Krzesla", "NM"];

    const renderItemFormField = ([label, key, type = "input"]) => (
        <div className="form-control" key={key}>
            <label className="label">
                <span className="label-text text-white">{label}</span>
            </label>
            {type === "textarea" ? (
                <textarea
                    value={modalData[key]}
                    onChange={(e) => setModalData({ ...modalData, [key]: e.target.value })}
                    className="textarea textarea-bordered h-24 w-full bg-gray-700 border-gray-600 text-white"
                />
            ) : key === "category" ? (
                <select
                    value={modalData[key]}
                    onChange={(e) => setModalData({ ...modalData, [key]: e.target.value })}
                    className="select select-bordered w-full bg-gray-700 border-gray-600 text-white"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={
                        ["ilosc", "wysokosc", "szerokosc", "glebokosc"].includes(key)
                            ? "number"
                            : "text"
                    }
                    value={modalData[key]}
                    onChange={(e) =>
                        setModalData({
                            ...modalData,
                            [key]:
                                ["name", "quantity", "description", "photo_url", "linknadysk", "stoisko"].includes(key)
                                    ? e.target.value
                                    : Number(e.target.value),
                        })
                    }
                    className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                />
            )}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-box w-full max-w-none sm:max-w-md p-4 sm:p-6 login-modal-dark"
            overlayClassName="modal-backdrop p-2 sm:p-0"
            contentLabel="Lodowki Modal"
        >
            <>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">
                    {editingItem ? "Edit Fridge" : "Add New Fridge"}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 modal-content">
                    {["Name", "name"],
                    ["Ilość", "ilosc"],
                    ["Category", "category"],
                    ["Description", "description", "textarea"],
                    ["Photo URL", "photo_url"],
                    ["Stoisko", "stoisko"],
                    ["Height (cm)", "wysokosc"],
                    ["Width (cm)", "szerokosc"],
                    ["Depth (cm)", "glebokosc"],
                    ["Google Drive Link", "linknadysk"],
                    ["Quantity (разновидность)", "quantity"],
                ]).map(renderItemFormField)
                    <div className="form-control">
                        <label className="form-label text-white text-sm sm:text-base">Data Wyjazdu</label>
                        <DatePicker
                            selected={modalData.dataWyjazdu && new Date(modalData.dataWyjazdu) instanceof Date && !isNaN(new Date(modalData.dataWyjazdu).getTime()) ? new Date(modalData.dataWyjazdu) : null}
                            onChange={(date) => setModalData({ ...modalData, dataWyjazdu: date })}
                            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                            dateFormat="yyyy-MM-dd"
                            isClearable
                            placeholderText="Select a date"
                        />
                    </div>
                    <div className="form-control">
                        <label className="form-label cursor-pointer text-white text-sm sm:text-base">
                            <span className="label-text text-white">Na stanie?</span>
                            <input
                                type="checkbox"
                                checked={modalData.stan}
                                onChange={(e) => setModalData({ ...modalData, stan: e.target.checked })}
                                className="checkbox"
                            />
                        </label>
                    </div>
                </div>
                <div className="button-group mt-4 flex gap-2">
                    <button onClick={onRequestClose} className="btn btn-ghost bg-gray-600 hover:bg-gray-500 text-white w-full sm:w-auto">
                        Cancel
                    </button>
                    <button onClick={handleSaveItem} className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                        Save
                    </button>
                </div>
            </>
        </Modal>
    );
}
