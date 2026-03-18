import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
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

  const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    return { statusCode: 500, body: JSON.stringify({ error: 'No DB URL' }) };
  }

  const sql = neon(dbUrl);

  try {
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'No body' }) };
      }
      
      const body = JSON.parse(event.body);
      const query = body.query || '';
      const params = Array.isArray(body.params) ? body.params : [];
      
      if (!query || query.trim() === '') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Empty query' }) };
      }
      
      let result;
      if (query.includes('$1') || query.includes('$2') || query.includes('$3')) {
        result = await sql.query(query, params.length > 0 ? params : [null]);
      } else {
        result = await sql(query);
      }
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(result)
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
