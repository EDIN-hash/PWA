import pg from 'pg';
const { Pool } = pg;

let pool = null;

function getPool() {
  if (!pool) {
    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('Database URL not set');
    }
    pool = new Pool({ connectionString: dbUrl });
  }
  return pool;
}

export async function handler(event, context) {
  // CORS preflight
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

  try {
    const pool = getPool();
    
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { query, params = [] } = body;

      const result = await pool.query(query, params);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.rows)
      };
    }

    // GET test
    const result = await pool.query('SELECT 1 as test');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
