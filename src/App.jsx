import React, { useState, useEffect, useCallback, useMemo } from "react";
import Card from "./Card.jsx";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import "./ecommerce-styles.css";
import NeonClient from "./neon-client";
import { generateDeviceId, getDeviceId } from "./device-utils";

// Настройка Modal до определения компонента
Modal.setAppElement("#root");

// Константы
const CATEGORIES = ["Telewizory", "Lodowki", "Ekspresy", "Krzesla", "NM"];
const STORAGE_KEYS = {
  DARK_MODE: 'darkMode'
};

const DEFAULT_MODAL_DATA = {
    name: "",
    quantity: "",
    ilosc: 1,
    description: "",
    photo_url: "",
    category: "NM",
    wysokosc: 0,
    szerokosc: 0,
    glebokosc: 0,
    dataWyjazdu: null,
    stoisko: "",
    stan: false,
    linknadysk: "",
};

// Утилиты
const safeParseDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    console.error("Invalid date format:", dateString, e);
    return null;
  }
};

const formatDateToISO = (date) => {
  if (!date) return null;
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch (e) {
    console.error("Invalid date in formatDateToISO:", date, e);
    return null;
  }
};

export default function App() {
    // Состояния
    const [state, setState] = useState({
        currentUser: null,
        username: "",
        password: "",
        showLoginModal: false,
        isRegisterModalOpen: false,
        registerUsername: "",
        registerPassword: "",
        registerRole: "spectator",
        items: [],
        searchQuery: "",
        isLoading: false,
        modalData: DEFAULT_MODAL_DATA,
        isItemModalOpen: false,
        editingItem: null,
        selectedCategory: "NM",
        darkMode: false,
        SERVER_URL: import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
    });

    // Мемоизированные значения для оптимизации рендеринга
    const {
        currentUser, username, password, showLoginModal, isRegisterModalOpen,
        registerUsername, registerPassword, registerRole, items, searchQuery,
        isLoading, modalData, isItemModalOpen, editingItem, selectedCategory,
        darkMode, SERVER_URL
    } = state;

    // Оптимизированный useEffect для darkMode
    useEffect(() => {
        // Загрузка предпочтений darkMode из localStorage
        const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
        if (savedDarkMode) {
            setState(prev => ({ ...prev, darkMode: savedDarkMode === 'true' }));
        }
    }, []);

    useEffect(() => {
        // Применение класса dark-mode к body
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, darkMode);
    }, [darkMode]);

    // Мемоизированные функции для оптимизации производительности
    const toggleDarkMode = useCallback(() => {
        setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    }, []);

    // Мемоизированные функции для работы с данными
    const fetchItems = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const fetchedItems = await NeonClient.getItems(selectedCategory || null);
            setState(prev => ({ ...prev, items: fetchedItems }));
        } catch (err) {
            console.error("Fetch items error:", err);
            alert(`Failed to load items: ${err.message}`);
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        try {
            const user = await NeonClient.loginUser(username, password);
            if (user) {
                setState(prev => ({
                    ...prev,
                    currentUser: user,
                    username: '',
                    password: '',
                    showLoginModal: false
                }));
            } else {
                alert('Invalid username or password');
            }
        } catch (err) {
            console.error("Login error:", err);
            alert(`Login failed: ${err.message}`);
        }
    }, [username, password]);

    const handleRegister = useCallback(async (e) => {
        e.preventDefault();
        try {
            await NeonClient.registerUser(registerUsername, registerPassword, registerRole);
            alert("Registration successful. You may log in.");
            setState(prev => ({
                ...prev,
                isRegisterModalOpen: false,
                registerUsername: "",
                registerPassword: "",
                registerRole: "spectator"
            }));
        } catch (err) {
            console.error("Registration error:", err);
            if (err.message.includes('Username already exists')) {
                alert("This username is already taken. Please choose a different username.");
            } else {
                alert(`Registration failed: ${err.message}`);
            }
        }
    }, [registerUsername, registerPassword, registerRole]);

    const handleLogout = useCallback(async () => {
        try {
            const validUrl = getValidServerUrl();
            await fetch(`${validUrl}/users/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        }
        setState(prev => ({ ...prev, currentUser: null }));
    }, []);

    const openItemModal = useCallback((item = null) => {
        setState(prev => ({
            ...prev,
            modalData: item
                ? {
                    ...item,
                    dataWyjazdu: safeParseDate(item.data_wyjazdu),
                    stan: item.stan === 1,
                }
                : DEFAULT_MODAL_DATA,
            editingItem: item || null,
            isItemModalOpen: true
        }));
    }, []);

    const closeItemModal = useCallback(() => {
        setState(prev => ({ ...prev, isItemModalOpen: false }));
    }, []);

    const handleSaveItem = useCallback(async () => {
        if (!modalData.name || !modalData.quantity) {
            alert("Name and quantity are required");
            return;
        }

        const itemData = {
            ...modalData,
            data_wyjazdu: formatDateToISO(modalData.dataWyjazdu),
            stan: modalData.stan ? 1 : 0,
            updatedBy: currentUser?.username || "Unknown",
            deviceId: generateDeviceId()
        };

        try {
            if (editingItem) {
                await NeonClient.updateItem(editingItem.name, itemData);
            } else {
                await NeonClient.addItem(itemData);
            }
            await fetchItems();
            closeItemModal();
        } catch (err) {
            console.error("Save item error:", err);
            alert(err.message);
        }
    }, [modalData, editingItem, currentUser, fetchItems, closeItemModal]);


    const handleDeleteItem = async (itemName) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await NeonClient.deleteItem(itemName);
            await fetchItems();
        } catch (err) {
            console.error("Delete item error:", err);
            alert(err.message);
        }
    };

    // Мемоизированная фильтрация элементов для оптимизации производительности
    const filteredItems = useMemo(() => {
        const itemsArray = Array.isArray(items) ? items : [];
        
        if (!searchQuery.trim()) return itemsArray;
        
        const query = searchQuery.toLowerCase();
        
        return itemsArray.filter((item) => {
            if (!item || !item.name) return false;
            
            const nameMatch = item.name.toLowerCase().includes(query);
            const descriptionMatch = (item.description || "").toLowerCase().includes(query);
            
            // Поиск по размерам (wysokosc, szerokosc, glebokosc)
            const dimensionsMatch = 
                (item.wysokosc && item.wysokosc.toString().includes(query)) ||
                (item.szerokosc && item.szerokosc.toString().includes(query)) ||
                (item.glebokosc && item.glebokosc.toString().includes(query));
            
            return nameMatch || descriptionMatch || dimensionsMatch;
        });
    }, [items, searchQuery]);

    // Мемоизированный рендеринг полей формы для оптимизации производительности
    const renderItemFormField = useCallback(([label, key, type = "input"]) => {
        const numericFields = ["ilosc", "wysokosc", "szerokosc", "glebokosc"];
        const textFields = ["name", "quantity", "description", "photo_url", "linknadysk", "stoisko"];
        
        const handleChange = (e) => {
            setState(prev => ({
                ...prev,
                modalData: {
                    ...prev.modalData,
                    [key]: textFields.includes(key) ? e.target.value : Number(e.target.value)
                }
            }));
        };

        return (
            <div className="form-control" key={key}>
                <label className="label">
                    <span className="label-text text-white">{label}</span>
                </label>
                {type === "textarea" ? (
                    <textarea
                        value={modalData[key]}
                        onChange={handleChange}
                        className="textarea textarea-bordered h-24 w-full bg-gray-700 border-gray-600 text-white"
                    />
                ) : key === "category" ? (
                    <select
                        value={modalData[key]}
                        onChange={(e) => setState(prev => ({
                            ...prev,
                            modalData: { ...prev.modalData, [key]: e.target.value }
                        }))}
                        className="select select-bordered w-full bg-gray-700 border-gray-600 text-white"
                    >
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={numericFields.includes(key) ? "number" : "text"}
                        value={modalData[key]}
                        onChange={handleChange}
                        className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                    />
                )}
            </div>
        );
    }, [modalData]);

return (
    <div className="min-h-screen ecommerce-body p-2 sm:p-6 transition-colors duration-300 ecommerce-container flex flex-col">
        <header className="ecommerce-header">
            <div className="ecommerce-navbar">
                <div className="flex items-center gap-4 w-full">
                    <a href="/" className="ecommerce-logo">
                        <div className="ecommerce-logo-icon">
                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                    </div>
                            Inventory Pro
                        </a>
                        
                        {!currentUser ? (
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto auth-section">
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="ecommerce-btn-primary w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                        </svg>
                        Login
                    </button>
                    <button
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="ecommerce-btn-secondary w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                        </svg>
                        Register
                    </button>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
                    <div className="ecommerce-search">
                        <svg className="ecommerce-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ecommerce-search-input w-full"
                        />
                    </div>
                    {currentUser.role === "admin" && (
                        <button
                            onClick={() => openItemModal()}
                            className="ecommerce-btn-primary w-full sm:w-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Add Product
                        </button>
                    )}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-white">{currentUser.username}</div>
                                <div className="text-sm text-indigo-100 capitalize">{currentUser.role}</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="ecommerce-btn-secondary w-full sm:w-auto">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
                    </div>
                </div>
            </header>

        {/* Category Tabs */}
        <div className="ecommerce-section">
            <div className="ecommerce-tabs">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`ecommerce-tab ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
            <div className="flex justify-center py-8">
                <div className="ecommerce-fade-in">
                    <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        ) : (
            <div className="ecommerce-grid">
                {filteredItems.map((item) => (
                    <Card
                        key={item.name}
                        item={item}
                        editItem={openItemModal}
                        deleteItem={handleDeleteItem}
                        role={currentUser?.role}
                    />
                ))}
            </div>
        )}

        {/* Item Modal */}
        <Modal
            isOpen={isItemModalOpen}
            onRequestClose={closeItemModal}
            className="ecommerce-modal mx-auto mt-8 mb-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            contentLabel="Item Modal"
        >
            <>
                <div className="ecommerce-modal-header">
                    <h2 className="ecommerce-modal-title">
                        {editingItem ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button onClick={closeItemModal} className="ecommerce-modal-close">
                        ×
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Product Name</label>
                        <input
                            type="text"
                            value={modalData.name}
                            onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                            className="ecommerce-form-input"
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Quantity</label>
                        <input
                            type="number"
                            value={modalData.ilosc}
                            onChange={(e) => setModalData({ ...modalData, ilosc: Number(e.target.value) })}
                            className="ecommerce-form-input"
                            placeholder="Enter quantity"
                            min="0"
                        />
                    </div>
                    
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Category</label>
                        <select
                            value={modalData.category}
                            onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                            className="ecommerce-form-input"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Description</label>
                        <textarea
                            value={modalData.description}
                            onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                            className="ecommerce-form-input h-32"
                            placeholder="Enter product description"
                        />
                    </div>
                    
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Photo URL</label>
                        <input
                            type="text"
                            value={modalData.photo_url}
                            onChange={(e) => setModalData({ ...modalData, photo_url: e.target.value })}
                            className="ecommerce-form-input"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
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
                <div className="flex gap-2 mt-6">
                    <button onClick={closeItemModal} className="ecommerce-btn-secondary w-full sm:w-auto">
                        Cancel
                    </button>
                    <button onClick={handleSaveItem} className="ecommerce-btn-primary w-full sm:w-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                        </svg>
                        Save Product
                    </button>
                </div>
            </>
        </Modal>

        {/* Login Modal */}
        <Modal
            isOpen={showLoginModal}
            onRequestClose={() => setShowLoginModal(false)}
            className="ecommerce-modal mx-auto mt-8 mb-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            contentLabel="Login Modal"
        >
            <>
                <div className="ecommerce-modal-header">
                    <h2 className="ecommerce-modal-title">Welcome Back</h2>
                    <button onClick={() => setShowLoginModal(false)} className="ecommerce-modal-close">
                        ×
                    </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="ecommerce-form-input"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ecommerce-form-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowLoginModal(false)}
                            className="ecommerce-btn-secondary w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="ecommerce-btn-primary w-full sm:w-auto">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                            </svg>
                            Login
                        </button>
                    </div>
                </form>
            </>
        </Modal>

        {/* Register Modal */}
        <Modal
            isOpen={isRegisterModalOpen}
            onRequestClose={() => setIsRegisterModalOpen(false)}
            className="ecommerce-modal mx-auto mt-8 mb-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            contentLabel="Register Modal"
        >
            <>
                <div className="ecommerce-modal-header">
                    <h2 className="ecommerce-modal-title">Create Account</h2>
                    <button onClick={() => setIsRegisterModalOpen(false)} className="ecommerce-modal-close">
                        ×
                    </button>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Username</label>
                        <input
                            type="text"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            className="ecommerce-form-input"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Password</label>
                        <input
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="ecommerce-form-input"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div className="ecommerce-form-group">
                        <label className="ecommerce-form-label">Role</label>
                        <select
                            value={registerRole}
                            onChange={(e) => setRegisterRole(e.target.value)}
                            className="ecommerce-form-input"
                        >
                            <option value="spectator">Spectator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsRegisterModalOpen(false)}
                            className="ecommerce-btn-secondary w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="ecommerce-btn-primary w-full sm:w-auto">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                            </svg>
                            Create Account
                        </button>
                    </div>
                </form>
            </>
        </Modal>
    </div>
);
}