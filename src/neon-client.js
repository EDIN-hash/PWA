// Функция для выполнения SQL запросов к Neon через Netlify функцию
const neonQuery = async (sql, params = []) => {
    // В разработке используем локальный URL, в продакшене - Netlify функцию
    const functionUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/neon-proxy'
        : '/.netlify/functions/neon-proxy';

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: sql,
                params: params
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
        return neonQuery(query, []);
    },

    // Добавление предмета
    async addItem(item) {
        // Try with deviceId first, fallback to version without it if column doesn't exist
        const queryWithDeviceId = `
            INSERT INTO items (
                name, quantity, ilosc, description, photo_url, category,
                wysokosc, szerokosc, glebokosc, data_wyjazdu, stan, linknadysk,
                updatedAt, updatedBy, deviceId, stoisko
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
            ) RETURNING *
        `;
        
        const queryWithoutDeviceId = `
            INSERT INTO items (
                name, quantity, ilosc, description, photo_url, category,
                wysokosc, szerokosc, glebokosc, data_wyjazdu, stan, linknadysk,
                updatedAt, updatedBy, stoisko
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            ) RETURNING *
        `;
        
        const paramsWithDeviceId = [
            item.name,
            item.quantity || '',
            item.ilosc || 0,
            item.description || '',
            item.photo_url || '',
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
        // Try with deviceId first, fallback to version without it if column doesn't exist
        const queryWithDeviceId = `
            UPDATE items SET
                quantity = $1,
                ilosc = $2,
                description = $3,
                photo_url = $4,
                category = $5,
                wysokosc = $6,
                szerokosc = $7,
                glebokosc = $8,
                data_wyjazdu = $9,
                stan = $10,
                linknadysk = $11,
                updatedAt = $12,
                updatedBy = $13,
                deviceId = $14,
                stoisko = $15
            WHERE name = $16 RETURNING *
        `;
        
        const queryWithoutDeviceId = `
            UPDATE items SET
                quantity = $1,
                ilosc = $2,
                description = $3,
                photo_url = $4,
                category = $5,
                wysokosc = $6,
                szerokosc = $7,
                glebokosc = $8,
                data_wyjazdu = $9,
                stan = $10,
                linknadysk = $11,
                updatedAt = $12,
                updatedBy = $13,
                stoisko = $14
            WHERE name = $15 RETURNING *
        `;
        
        const paramsWithDeviceId = [
            item.quantity || '',
            item.ilosc || 0,
            item.description || '',
            item.photo_url || '',
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

    // Логин пользователя
    async loginUser(username, password) {
        const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
        const result = await neonQuery(query, [username, password]);
        return result.length > 0 ? result[0] : null;
    }
};

export default NeonClient;