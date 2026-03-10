import { useState } from "react";
import Modal from "react-modal";
import { categories } from "../../constants/categories";
import NeonClient from "../../neon-client";

Modal.setAppElement("#root");

export default function GetIdModal({ 
    isOpen, 
    onClose, 
    selectedCategory, 
    setSelectedCategory,
    tvSize,
    setTvSize 
}) {
    const [generatedId, setGeneratedId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGetNextId = async () => {
        setIsGenerating(true);
        try {
            const nextId = await NeonClient.getNextAvailableId(selectedCategory, tvSize);
            setGeneratedId(nextId);
        } catch (err) {
            console.error("Get next ID error:", err);
            if (err.message.includes('Все ID для телевизоров размера')) {
                alert(err.message);
            } else {
                alert("Failed to get next ID: " + err.message);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyId = () => {
        if (generatedId) {
            navigator.clipboard.writeText(generatedId);
            alert(`ID ${generatedId} copied to clipboard!`);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        if (e.target.value !== 'Telewizory') {
            setTvSize('55');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-box w-full max-w-none sm:max-w-md p-4 sm:p-6 login-modal-dark get-free-id-modal"
            overlayClassName="modal-backdrop p-2 sm:p-0"
            contentLabel="Get Free ID Modal"
        >
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Get Free ID</h2>
            <div className="space-y-3 sm:space-y-4 modal-content">
                <div className="form-control">
                    <label className="form-label text-sm sm:text-base text-white">Category</label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="select select-bordered w-full bg-gray-700 border-gray-600 text-white"
                    >
                        {categories.filter(cat => cat !== 'Historia').map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                
                {selectedCategory === 'Telewizory' && (
                    <div className="form-control">
                        <label className="form-label text-sm sm:text-base text-white">Размер экрана (дюймы)</label>
                        <input
                            type="text"
                            value={tvSize}
                            onChange={(e) => setTvSize(e.target.value)}
                            placeholder="Введите размер (например, 55)"
                            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                )}
                
                <div className="form-control">
                    <button
                        onClick={handleGetNextId}
                        disabled={isGenerating}
                        className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                        {isGenerating ? 'Generating...' : 'Get Free ID'}
                    </button>
                </div>
                
                {generatedId && (
                    <div className="form-control generated-id-section">
                        <label className="form-label text-sm sm:text-base text-white">Generated ID</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={generatedId}
                                readOnly
                                className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                            />
                            <div className="copy-button-container">
                                <button
                                    onClick={handleCopyId}
                                    className="btn btn-info bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="button-group mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost bg-gray-600 hover:bg-gray-500 text-white w-full sm:w-auto"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
