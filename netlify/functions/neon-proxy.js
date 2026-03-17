import { neon } from '@neondatabase/serverless';

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

  const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    return { statusCode: 500, body: JSON.stringify({ error: 'No DB URL' }) };
  }

  const sql = neon(dbUrl);

  try {
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { query, params = [] } = body;

      // Neon драйвер требует tagged template синтаксис
      // Для этого используем функцию которая создает tagged template
      const tag = (strings, ...values) => {
        return strings.reduce((result, str, i) => {
          return result + str + (i < values.length ? values[i] : '');
        }, '');
      };

      // Заменяем $1, $2... на значения из params
      let finalQuery = query;
      params.forEach((param, i) => {
        const placeholder = '$' + (i + 1);
        // Экранируем значение
        let value;
        if (param === null || param === undefined) {
          value = 'NULL';
        } else if (typeof param === 'number') {
          value = param;
        } else if (typeof param === 'boolean') {
          value = param ? 'TRUE' : 'FALSE';
        } else {
          value = "'" + String(param).replace(/'/g, "''") + "'";
        }
        finalQuery = finalQuery.replace(placeholder, value);
      });

      // Выполняем как raw SQL через tagged template
      const result = await sql`${finalQuery}`;
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(result)
      };
    }

    const result = await sql`SELECT 1 as test`;
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
  }
}
