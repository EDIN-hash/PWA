import { neon } from '@neondatabase/serverless';

export const handler = async (event) => {
    // Настраиваем подключение к Neon
    const sql = neon(process.env.DATABASE_URL);
    
    // Разбираем запрос
    const { query, params = [] } = JSON.parse(event.body);
    
    try {
        // Выполняем запрос с использованием правильного синтаксиса Neon
        const result = await sql.query(query);
        
        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    } catch (error) {
        console.error('Neon query error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }
};

// Обработка OPTIONS запросов для CORS
export const handlerOptions = async () => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };
};