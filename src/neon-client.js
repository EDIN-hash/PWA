// Функция для выполнения SQL запросов к Neon через Netlify функцию
const neonQuery = async (sql, params = []) => {
    // В разработке используем локальный URL, в продакшене - Netlify функцию
    const functionUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/neon-proxy'
        : '/.netlify/functions/neon-proxy';

    // Экранируем параметры для безопасности
    const escapeParam = (param) => {
        if (param === null || param === undefined) return 'NULL';
        if (typeof param === 'number') return param;
        if (typeof param === 'boolean') return param ? 'TRUE' : 'FALSE';
        // Экранируем одинарные кавычки
        return "'" + String(param).replace(/'/g, "''") + "'";
    };

    // Заменяем $1, $2, etc. на экранированные значения
    let finalQuery = sql;
    if (params && params.length > 0) {
        params.forEach((param, index) => {
            const placeholder = '$' + (index + 1);
            finalQuery = finalQuery.split(placeholder).join(escapeParam(param));
        });
    }

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: finalQuery,
                params: []
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Neon query failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Neon query error:', error);
        throw error;
    }
};

// Функции для работы с данными
const NeonClient = {
    // Экспортируем функцию для тестирования
    query: neonQuery,
    
    // Получение всех предметов
    async getItems(category = null) {
        let query = 'SELECT * FROM items';
        if (category) {
            query += ' WHERE category = $1';
            return neonQuery(query, [category]);
        }
        return neonQuery(query);
    },

    // Добавление предмета
    async addItem(item) {
        // Try with deviceId and photo_url2 first, fallback to version without them if columns don't exist
        const queryWithDeviceId = `
            INSERT INTO items (
                name, quantity, ilosc, description, photo_url, photo_url2, category,
                wysokosc, szerokosc, glebokosc, data_wyjazdu, stan, linknadysk,
                updatedAt, updatedBy, deviceId, stoisko
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            ) RETURNING *
        `;
        
        const queryWithoutDeviceId = `
            INSERT INTO items (
                name, quantity, ilosc, description, photo_url, photo_url2, category,
                wysokosc, szerokosc, glebokosc, data_wyjazdu, stan, linknadysk,
                updatedAt, updatedBy, stoisko
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
            ) RETURNING *
        `;
        
        const paramsWithDeviceId = [
            item.name,
            item.quantity || '',
            item.ilosc || 0,
            item.description || '',
            item.photo_url || '',
            item.photo_url2 || '',
            item.category || 'NM',
            item.wysokosc || 0,
            item.szerokosc || 0,
            item.glebokosc || 0,
            item.data_wyjazdu || null,
            item.stan || 0,
            item.linknadysk || '',
            new Date().toISOString(),
            item.updatedBy || 'Unknown',
            item.deviceId || 'Unknown',
            item.stoisko || ''
        ];
        
        const paramsWithoutDeviceId = [
            item.name,
            item.quantity || '',
            item.ilosc || 0,
            item.description || '',
            item.photo_url || '',
            item.photo_url2 || '',
            item.category || 'NM',
            item.wysokosc || 0,
            item.szerokosc || 0,
            item.glebokosc || 0,
            item.data_wyjazdu || null,
            item.stan || 0,
            item.linknadysk || '',
            new Date().toISOString(),
            item.updatedBy || 'Unknown',
            item.stoisko || ''
        ];
        
        try {
            return await neonQuery(queryWithDeviceId, paramsWithDeviceId);
        } catch (error) {
            if (error.message.includes('column "deviceId" does not exist') || error.message.includes('column "deviceid" does not exist')) {
                console.warn('deviceId column not found, using fallback query');
                return await neonQuery(queryWithoutDeviceId, paramsWithoutDeviceId);
            }
            throw error;
        }
    },

    // Обновление предмета
    async updateItem(name, item) {
        // Try with deviceId and photo_url2 first, fallback to version without them if columns don't exist
        const queryWithDeviceId = `
            UPDATE items SET
                quantity = $1,
                ilosc = $2,
                description = $3,
                photo_url = $4,
                photo_url2 = $5,
                category = $6,
                wysokosc = $7,
                szerokosc = $8,
                glebokosc = $9,
                data_wyjazdu = $10,
                stan = $11,
                linknadysk = $12,
                updatedAt = $13,
                updatedBy = $14,
                deviceId = $15,
                stoisko = $16
            WHERE name = $17 RETURNING *
        `;
        
        const queryWithoutDeviceId = `
            UPDATE items SET
                quantity = $1,
                ilosc = $2,
                description = $3,
                photo_url = $4,
                photo_url2 = $5,
                category = $6,
                wysokosc = $7,
                szerokosc = $8,
                glebokosc = $9,
                data_wyjazdu = $10,
                stan = $11,
                linknadysk = $12,
                updatedAt = $13,
                updatedBy = $14,
                stoisko = $15
            WHERE name = $16 RETURNING *
        `;
        
        const paramsWithDeviceId = [
            item.quantity || '',
            item.ilosc || 0,
            item.description || '',
            item.photo_url || '',
            item.photo_url2 || '',
            item.category || 'NM',
            item.wysokosc || 0,
            item.szerokosc || 0,
            item.glebokosc || 0,
            item.data_wyjazdu || null,
            item.stan || 0,
            item.linknadysk || '',
            new Date().toISOString(),
            item.updatedBy || 'Unknown',
            item.deviceId || 'Unknown',
            item.stoisko || '',
            name
        ];
        
        const paramsWithoutDeviceId = [
            item.quantity || '',
            item.ilosc || 0,
            item.description || '',
            item.photo_url || '',
            item.photo_url2 || '',
            item.category || 'NM',
            item.wysokosc || 0,
            item.szerokosc || 0,
            item.glebokosc || 0,
            item.data_wyjazdu || null,
            item.stan || 0,
            item.linknadysk || '',
            new Date().toISOString(),
            item.updatedBy || 'Unknown',
            item.stoisko || '',
            name
        ];
        
        try {
            return await neonQuery(queryWithDeviceId, paramsWithDeviceId);
        } catch (error) {
            if (error.message.includes('column "deviceId" does not exist') || error.message.includes('column "deviceid" does not exist')) {
                console.warn('deviceId column not found in update, using fallback query');
                return await neonQuery(queryWithoutDeviceId, paramsWithoutDeviceId);
            }
            throw error;
        }
    },

    // Удаление предмета
    async deleteItem(name) {
        const query = 'DELETE FROM items WHERE name = $1 RETURNING *';
        return neonQuery(query, [name]);
    },

    // Регистрация пользователя
    async registerUser(username, password, role = 'spectator') {
        // В реальном приложении нужно хэшировать пароль на сервере
        // Здесь для простоты мы сохраняем пароль как есть (небезопасно!)
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
        try {
            return await neonQuery(query, [username, password, role]);
        } catch (error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                throw new Error('Username already exists. Please choose a different username.');
            }
            throw error;
        }
    },

    // Получение свободного ID для категории
    async getNextAvailableId(category, tvSize = '55') {
        // Для телевизоров специальная логика
        if (category === 'Telewizory') {
            const query = 'SELECT name FROM items WHERE category = $1 AND name LIKE $2 ORDER BY name';
            const result = await neonQuery(query, [category, `TV${tvSize}%`]);
            
            const usedNumbers = new Set();
            
            result.forEach(item => {
                const match = item.name.match(new RegExp(`TV${tvSize}(\\d{3})`));
                if (match) {
                    const number = parseInt(match[1]);
                    usedNumbers.add(number);
                }
            });
            
            // Найти первый свободный номер с 1 до 999
            for (let nextNumber = 1; nextNumber <= 999; nextNumber++) {
                if (!usedNumbers.has(nextNumber)) {
                    return `TV${tvSize}${nextNumber.toString().padStart(3, '0')}`;
                }
            }
            
            // Если все номера для указанного размера заняты, вернуть ошибку
            throw new Error(`Все ID для телевизоров размера ${tvSize}" заняты. Попробуйте другой размер или обратитесь к администратору.`);
        }
        
        // Для других категорий
        const prefixMap = {
            'Lodowki': 'L',
            'Ekspresy': 'E',
            'Krzesla': 'K',
            'NM': 'NM',
            'LADY': 'A'
        };
        
        const prefix = prefixMap[category] || 'X';
        const query = 'SELECT name FROM items WHERE category = $1 AND name LIKE $2 ORDER BY name';
        const result = await neonQuery(query, [category, `${prefix}%`]);
        
        const usedNumbers = new Set();
        result.forEach(item => {
            const match = item.name.match(new RegExp(`${prefix}(\\d+)`));
            if (match) {
                usedNumbers.add(parseInt(match[1]));
            }
        });
        
        // Найти первый свободный номер
        let nextNumber = 1;
        while (usedNumbers.has(nextNumber)) {
            nextNumber++;
        }
        
        return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    },

    // Логин пользователя
    async loginUser(username, password) {
        const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
        const result = await neonQuery(query, [username, password]);
        return result.length > 0 ? result[0] : null;
    },

    // История изменений
    async addHistoryEntry(entry) {
        const query = `
            INSERT INTO history (item_name, action, field_name, old_value, new_value, changed_by, device_id, timestamp) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
            RETURNING *
        `;
        
        const params = [
            entry.item_name || '',
            entry.action || 'edit',
            entry.field_name || '',
            entry.old_value || '',
            entry.new_value || '',
            entry.changed_by || 'Unknown',
            entry.device_id || 'Unknown'
        ];
        
        try {
            return await neonQuery(query, params);
        } catch (error) {
            console.warn('History logging failed:', error.message);
            return null;
        }
    },

    // Получить историю (все или для конкретного товара)
    async getHistory(itemName = null) {
        if (itemName && itemName.trim()) {
            const query = 'SELECT * FROM history WHERE item_name = $1 ORDER BY timestamp DESC LIMIT 100';
            try {
                return await neonQuery(query, [itemName]);
            } catch (error) {
                console.warn('History table may not exist:', error.message);
                return [];
            }
        } else {
            const query = 'SELECT * FROM history ORDER BY timestamp DESC LIMIT 200';
            try {
                return await neonQuery(query);
            } catch (error) {
                console.warn('History table may not exist:', error.message);
                return [];
            }
        }
    },

    // Очистка истории
    async clearHistory() {
        const query = 'DELETE FROM history RETURNING *';
        try {
            return await neonQuery(query);
        } catch (error) {
            console.warn('Could not clear history:', error.message);
            return [];
        }
    }
};

export default NeonClient;
