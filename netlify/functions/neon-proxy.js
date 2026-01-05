import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  try {
    console.log('Starting database connection...');

    // Проверяем доступность переменной
    if (!process.env.NETLIFY_DATABASE_URL) {
      console.error('NETLIFY_DATABASE_URL is missing!');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database connection string is missing',
          availableEnv: Object.keys(process.env)
        })
      };
    }

    console.log('NETLIFY_DATABASE_URL is set, connecting...');

    // Используем правильную переменную окружения
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Простой тестовый запрос
    const result = await sql`SELECT 1 as test_value, current_database() as db_name`;

    console.log('Query successful!');

    return {
      statusCode: 200,
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