import { neon } from '@neondatabase/serverless';

const VERSION = 'v3';

export async function handler(event, context) {
  const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    return { statusCode: 500, body: JSON.stringify({ error: 'No DB URL' }) };
  }

  const sql = neon(dbUrl);

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
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { query, params = [] } = body;

      let result;
      if (params.length > 0) {
        let convertedQuery = query;
        for (let i = 0; i < params.length; i++) {
          convertedQuery = convertedQuery.replace(`$${i + 1}`, `?`);
        }
        result = await sql.query(convertedQuery, params);
      } else {
        result = await sql`${query}`;
      }
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(Array.isArray(result) ? result : [result])
      };
    }

    const result = await sql`SELECT 1 as test`;
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
  }
}
