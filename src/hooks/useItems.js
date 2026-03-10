import { useState, useEffect, useCallback } from "react";
import NeonClient from "../neon-client";
import { generateDeviceId } from "../device-utils";
import { defaultModalData } from "../constants/categories";

export function useItems(selectedCategory, currentUser) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalData, setModalData] = useState(defaultModalData);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('Fetching for category:', selectedCategory);
            if (selectedCategory === 'Historia') {
                console.log('Fetching history...');
                const history = await NeonClient.getHistory();
                console.log('History data:', history);
                setItems(history);
            } else {
                const items = await NeonClient.getItems(selectedCategory || null);
                setItems(items);
            }
        } catch (err) {
            console.error("Fetch items error:", err);
            alert("Failed to load items: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const parsePolishNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        const numericValue = typeof value === 'string' 
            ? parseFloat(value.replace(',', '.')) 
            : Number(value);
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const openItemModal = (item = null) => {
        if (item) {
            setModalData({
                ...item,
                wysokosc: parsePolishNumber(item.wysokosc),
                szerokosc: parsePolishNumber(item.szerokosc),
                glebokosc: parsePolishNumber(item.glebokosc),
                ilosc: parsePolishNumber(item.ilosc),
                dataWyjazdu: item.data_wyjazdu || '',
                stan: item.stan === 1 || item.stan === true,
            });
        } else {
            setModalData(defaultModalData);
        }
        setEditingItem(item || null);
        setIsItemModalOpen(true);
    };

    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setEditingItem(null);
    };

    const saveItem = async () => {
        if (!modalData.name) {
            alert("ID (Name) jest wymagany!");
            return false;
        }
        
        const currentUsername = currentUser?.username || "Unknown";
        const currentDeviceId = generateDeviceId();
        
        const itemData = {
            ...modalData,
            data_wyjazdu: modalData.dataWyjazdu || '',
            stan: modalData.stan ? 1 : 0,
            ilosc: modalData.ilosc || 0,
            quantity: modalData.quantity || '',
            description: modalData.description || '',
            photo_url: modalData.photo_url || '',
            photo_url2: modalData.photo_url2 || '',
            linknadysk: modalData.linknadysk || '',
            stoisko: modalData.stoisko || '',
            updatedBy: currentUsername,
            deviceId: currentDeviceId
        };
        
        try {
            if (editingItem) {
                await NeonClient.updateItem(editingItem.name, itemData);
            } else {
                await NeonClient.addItem(itemData);
            }
            
            try {
                if (editingItem) {
                    await NeonClient.addHistoryEntry({
                        item_name: modalData.name,
                        action: 'edit',
                        field_name: 'all',
                        old_value: editingItem.name !== modalData.name ? editingItem.name : '',
                        new_value: modalData.name,
                        changed_by: currentUsername,
                        device_id: currentDeviceId
                    });
                } else {
                    await NeonClient.addHistoryEntry({
                        item_name: modalData.name,
                        action: 'add',
                        field_name: 'new_item',
                        old_value: '',
                        new_value: modalData.category,
                        changed_by: currentUsername,
                        device_id: currentDeviceId
                    });
                }
            } catch (historyErr) {
                console.warn("History logging failed:", historyErr);
            }
            
            await fetchItems();
            closeItemModal();
            return true;
        } catch (err) {
            console.error("Save item error:", err);
            alert(err.message);
            return false;
        }
    };

    const deleteItem = async (itemName) => {
        if (!window.confirm("Delete this item?")) return false;
        
        const currentUsername = currentUser?.username || "Unknown";
        const currentDeviceId = generateDeviceId();
        
        try {
            await NeonClient.deleteItem(itemName);
            try {
                await NeonClient.addHistoryEntry({
                    item_name: itemName,
                    action: 'delete',
                    field_name: 'all',
                    old_value: '',
                    new_value: '',
                    changed_by: currentUsername,
                    device_id: currentDeviceId
                });
            } catch (historyErr) {
                console.warn("History logging failed:", historyErr);
            }
            await fetchItems();
            return true;
        } catch (err) {
            console.error("Delete item error:", err);
            alert(err.message);
            return false;
        }
    };

    return {
        items,
        setItems,
        isLoading,
        setIsLoading,
        fetchItems,
        modalData,
        setModalData,
        isItemModalOpen,
        setIsItemModalOpen,
        editingItem,
        setEditingItem,
        openItemModal,
        closeItemModal,
        saveItem,
        deleteItem,
    };
}
