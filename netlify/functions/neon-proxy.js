import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  try {
    const sql = neon(process.env.DATABASE_URL, {
      fetchOptions: {
        timeout: 30000
      },
      usePool: false
    });

    // Ваш запрос здесь
    const result = await sql`SELECT * FROM your_table`;

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Neon query error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Database query failed',
        details: error.message
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