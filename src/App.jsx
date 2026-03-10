import React, { useState, useEffect } from "react";
import "./styles.css";
import { useAuth } from "./hooks/useAuth";
import { useItems } from "./hooks/useItems";
import { useFilters } from "./hooks/useFilters";
import { LoginModal, RegisterModal, ItemModal, GetIdModal } from "./components/modals";
import { CategoryTabs, Controls, ItemsGrid } from "./components/ui";
import NeonClient from "./neon-client";
import { generateDeviceId } from "./device-utils";

export default function App() {
    const [selectedCategory, setSelectedCategory] = useState("NM");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isGetIdModalOpen, setIsGetIdModalOpen] = useState(false);
    const [selectedCategoryForId, setSelectedCategoryForId] = useState('NM');
    const [tvSize, setTvSize] = useState('55');

    useEffect(() => {
        NeonClient.ensureHistoryTable();
    }, []);

    const { 
        currentUser, 
        username, setUsername, 
        password, setPassword, 
        registerUsername, setRegisterUsername,
        registerPassword, setRegisterPassword,
        registerRole, setRegisterRole,
        login, 
        register, 
        logout 
    } = useAuth();

    const { 
        items, 
        isLoading, 
        fetchItems,
        modalData,
        setModalData,
        isItemModalOpen,
        editingItem,
        openItemModal,
        closeItemModal,
        saveItem,
        deleteItem
    } = useItems(selectedCategory, currentUser);

    const { 
        searchQuery, 
        setSearchQuery,
        sortConfig,
        statusFilter,
        setStatusFilter,
        actionFilter,
        setActionFilter,
        filteredItems,
        toggleSort,
        resetSort
    } = useFilters(items, selectedCategory);

    useEffect(() => {
        if (currentUser && selectedCategory) {
            NeonClient.addHistoryEntry({
                item_name: selectedCategory,
                action: 'view_category',
                field_name: 'category_opened',
                old_value: '',
                new_value: selectedCategory,
                changed_by: currentUser.username,
                device_id: generateDeviceId()
            }).catch(() => {});
        }
    }, [selectedCategory, currentUser]);

    const canAddItem = currentUser?.role === "admin" && selectedCategory !== 'Historia';
    const canGetFreeId = (currentUser?.role === "admin" || currentUser?.role === "moder") && selectedCategory !== 'Historia';

    return (
        <div className="min-h-screen bg-[#1a1b26] p-2 sm:p-6 transition-colors duration-300 main-container flex flex-col gradient-bg">
            <header className="header-section flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 header-modern glass-effect">
                <div className="flex items-center gap-4 w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold main-title text-center sm:text-left text-gradient fade-in-up tokyo-accent">
                        Inventory Management
                    </h1>
                </div>
            
                {!currentUser ? (
                    <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto auth-section">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="btn btn-primary w-full sm:w-auto ripple hover-lift"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="btn btn-secondary w-full sm:w-auto ripple hover-lift"
                        >
                            Register
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-bordered bg-gray-700 border-gray-600 text-white flex-1 min-w-0"
                            style={{ minWidth: '200px' }}
                        />
                        {canAddItem && (
                            <button
                                onClick={() => openItemModal()}
                                className="btn btn-success w-full sm:w-auto ripple hover-lift bounce-in flex-shrink-0"
                            >
                                Add Item
                            </button>
                        )}
                        {canGetFreeId && (
                            <button
                                onClick={() => setIsGetIdModalOpen(true)}
                                className="btn btn-info w-full sm:w-auto ripple hover-lift bounce-in flex-shrink-0"
                            >
                                Get Free ID
                            </button>
                        )}
                        <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                            <span className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Logged in as: {currentUser.username}</span>
                            <span className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Role: {currentUser.role}</span>
                            <button onClick={logout} className="btn btn-error w-full sm:w-auto">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <CategoryTabs 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory}
                currentUser={currentUser}
            />

            <Controls 
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortConfig={sortConfig}
                toggleSort={toggleSort}
                resetSort={resetSort}
                selectedCategory={selectedCategory}
                actionFilter={actionFilter}
                setActionFilter={setActionFilter}
            />

            <ItemsGrid 
                items={filteredItems}
                isLoading={isLoading}
                selectedCategory={selectedCategory}
                editItem={openItemModal}
                deleteItem={deleteItem}
                role={currentUser?.role}
            />

            <ItemModal 
                isOpen={isItemModalOpen}
                onClose={closeItemModal}
                modalData={modalData}
                setModalData={setModalData}
                editingItem={editingItem}
                onSave={saveItem}
            />

            <LoginModal 
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                onSubmit={login}
            />

            <RegisterModal 
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                username={registerUsername}
                setUsername={setRegisterUsername}
                password={registerPassword}
                setPassword={setRegisterPassword}
                role={registerRole}
                setRole={setRegisterRole}
                onSubmit={register}
            />

            <GetIdModal 
                isOpen={isGetIdModalOpen}
                onClose={() => setIsGetIdModalOpen(false)}
                selectedCategory={selectedCategoryForId}
                setSelectedCategory={setSelectedCategoryForId}
                tvSize={tvSize}
                setTvSize={setTvSize}
            />
        </div>
    );
}
