import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';

export async function handler(event, context) {
  try {
    console.log('Starting database connection...');

    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('Database URL is missing!');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database connection string is missing'
        })
      };
    }

    // Используем pg Pool для поддержки $1, $2 параметров
    const pool = new Pool({ connectionString: dbUrl });

    // Обрабатываем OPTIONS запросы для CORS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    // Обрабатываем POST запросы с SQL запросом
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { query, params } = body;
      
      console.log('Executing query:', query);
      console.log('With params:', params);

      let result;
      if (params && Array.isArray(params) && params.length > 0) {
        // Используем pool для параметризованных запросов
        result = await pool.query(query, params);
      } else {
        // Без параметров
        result = await pool.query(query);
      }
      
      console.log('Query executed successfully');
      
      await pool.end();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.rows)
      };
    }

    // Простой тестовый запрос для GET
    const result = await pool.query('SELECT 1 as test_value, current_database() as db_name');
    await pool.end();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: result.rows[0]
      })
    };
  } catch (error) {
    console.error('Database connection error:', error.message);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}

    console.log('Database URL is set, connecting...');

    // Используем доступную переменную окружения
    const sql = neon(dbUrl);

    // Обрабатываем OPTIONS запросы для CORS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    // Обрабатываем POST запросы с SQL запросом
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { query, params } = body;
      
      console.log('Executing query:', query);
      console.log('With params:', params);

      // Используем правильный синтаксис для Neon драйвера
      let result;
      if (params && Array.isArray(params) && params.length > 0) {
        // Для параметризованных запросов используем метод .query()
        result = await sql.query(query, params);
      } else {
        // Без параметров используем tagged template
        result = await sql`${sql(query)}`;
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

