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
      const type = body.type || 'default';
      
      if (!query || query.trim() === '') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Empty query' }) };
      }
      
      let result;
      
      // History queries use sql.unsafe with param substitution
      if (type === 'history') {
        const debug = { query, params, builtQuery: query };
        if (params.length > 0) {
          let builtQuery = query;
          params.forEach((p, i) => {
            const placeholder = `$${i+1}`;
            const regex = new RegExp(placeholder.replace('$', '\\$'), 'g');
            if (p === null || p === undefined) {
              builtQuery = builtQuery.replace(regex, 'NULL');
            } else if (typeof p === 'number') {
              builtQuery = builtQuery.replace(regex, String(p));
            } else {
              builtQuery = builtQuery.replace(regex, `'${String(p).replace(/'/g, "''")}'`);
            }
          });
          debug.builtQuery = builtQuery;
          result = await sql.unsafe(builtQuery);
        } else {
          result = await sql.unsafe(query);
        }
        
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ ...result, _debug: debug })
        };
      } else {
        // Default queries - original working code
        if (params.length > 0) {
          result = await sql.query(query, params);
        } else {
          result = await sql(query);
        }
      }
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(result)
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error('Proxy error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack, query, params }) };
  }
}
