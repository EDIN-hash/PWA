import Modal from "react-modal";
import { categories } from "../../constants/categories";

Modal.setAppElement("#root");

export default function ItemModal({ 
    isOpen, 
    onClose, 
    modalData, 
    setModalData, 
    editingItem, 
    onSave 
}) {
    console.log('ItemModal render:', { isOpen, editingItem });
    
    const modalStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1e1e2e',
            border: '1px solid rgba(76, 100, 241, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: '#c0caf5',
            zIndex: 10000,
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    };

    const renderItemFormField = ([label, key, type = "input"]) => {
        let displayLabel = label;
        if (modalData.category === 'Krzesla' && key === 'wysokosc') {
            displayLabel = 'Ilosc wyjechala';
        }
        
        return (
            <div className="form-control" key={key}>
                <label className="label">
                    <span className="label-text text-white">{displayLabel}</span>
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
                                        : (() => {
                                            const value = e.target.value;
                                            if (value === '') return 0;
                                            const numericValue = parseFloat(value.replace(',', '.'));
                                            return isNaN(numericValue) ? 0 : numericValue;
                                        })(),
                            })
                        }
                        className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                    />
                )}
            </div>
        );
    };

    const getFormFields = () => {
        if (modalData.category === 'Krzesla') {
            return [
                ["Name", "name"],
                ["Ilość", "ilosc"],
                ["Category", "category"],
                ["Ilosc wyjechala", "wysokosc"],
                ["Description", "description", "textarea"],
                ["Photo URL", "photo_url"],
                ["Stoisko", "stoisko"],
                ["Szerokość (cm)", "szerokosc"],
                ["Głębokość (cm)", "glebokosc"],
                ["Google Drive Link", "linknadysk"]
            ];
        }
        
        if (modalData.category === 'LADY') {
            return [
                ["Name", "name"],
                ["Ilość", "ilosc"],
                ["Category", "category"],
                ["Description", "description", "textarea"],
                ["Photo URL 1", "photo_url"],
                ["Photo URL 2", "photo_url2"],
                ["Stoisko", "stoisko"],
                ["Google Drive Link", "linknadysk"]
            ];
        }
        
        return [
            ["Name", "name"],
            ["Ilość", "ilosc"],
            ["Category", "category"],
            ["Description", "description", "textarea"],
            ["Photo URL", "photo_url"],
            ["Stoisko", "stoisko"],
            ["Wysokość (cm)", "wysokosc"],
            ["Szerokość (cm)", "szerokosc"],
            ["Głębokość (cm)", "glebokosc"],
            ["Google Drive Link", "linknadysk"],
            ["Quantity (разновидность)", "quantity"],
        ];
    };

    const handleDataWyjazduChange = (value) => {
        let cleaned = value.replace(/[^\d.]/g, '');
        if (cleaned.length === 2 || cleaned.length === 5) {
            cleaned += '.';
        }
        if (cleaned.length <= 10) {
            setModalData({ ...modalData, dataWyjazdu: cleaned });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            contentLabel="Item Modal"
            shouldCloseOnOverlayClick={true}
        >
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">
                {editingItem ? "Edit Item" : "Add New Item"}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 modal-content">
                {getFormFields().map(renderItemFormField)}
                
                <div className="form-control">
                    <label className="form-label text-white text-sm sm:text-base">Data Wyjazdu</label>
                    <input
                        type="text"
                        value={modalData.dataWyjazdu || ''}
                        onChange={(e) => handleDataWyjazduChange(e.target.value)}
                        className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                        placeholder="DD.MM.RRRR"
                        maxLength={10}
                    />
                </div>
                
                {modalData.category !== 'Krzesla' && (
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
                )}
            </div>
            <div className="button-group mt-4 flex gap-2">
                <button onClick={onClose} className="btn btn-ghost bg-gray-600 hover:bg-gray-500 text-white w-full sm:w-auto">
                    Cancel
                </button>
                <button onClick={onSave} className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                    Save
                </button>
            </div>
        </Modal>
    );
}
