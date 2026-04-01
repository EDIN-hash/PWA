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
      let query = body.query || '';
      const params = Array.isArray(body.params) ? body.params : [];
      
      if (!query || query.trim() === '') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Empty query' }) };
      }
      
      // Substitute params in query
      params.forEach((p, i) => {
        const placeholder = `$${i+1}`;
        const regex = new RegExp(placeholder.replace('$', '\\$'), 'g');
        if (p === null || p === undefined) {
          query = query.replace(regex, 'NULL');
        } else if (typeof p === 'number') {
          query = query.replace(regex, String(p));
        } else {
          query = query.replace(regex, `'${String(p).replace(/'/g, "''")}'`);
        }
      });
      
      const result = await sql.unsafe(query);
      
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
