import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  try {
    console.log('Starting database connection...');

    // Проверяем доступность переменной
    // В локальной разработке используем DATABASE_URL, в продакшене - NETLIFY_DATABASE_URL
    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('Database URL is missing!');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database connection string is missing',
          availableEnv: Object.keys(process.env)
        })
      };
    }

    console.log('Database URL is set, connecting...');

    // Используем доступную переменную окружения
    const sql = neon(dbUrl);

    // Обрабатываем POST запросы с SQL запросом
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { query, params } = body;
      
      console.log('Executing query:', query);
      console.log('With params:', params);

      // Используем правильный синтаксис для вызова SQL запроса
      // Для запросов с параметрами используем sql.query()
      let result;
      if (params && params.length > 0) {
        // Если есть параметры, используем sql.query()
        result = await sql.query(query, params);
      } else {
        // Если нет параметров, используем tagged template
        result = await sql`${query}`;
      }
      
      console.log('Query executed successfully:', result);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      };
    }

    // Простой тестовый запрос для GET
    const result = await sql`SELECT 1 as test_value, current_database() as db_name`;

    console.log('Query successful!');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Database connection successful!',
        data: result[0],
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Database connection error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      })
    };
  }
}

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