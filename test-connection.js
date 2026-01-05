// Создайте тестовый скрипт test-connection.js
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
    const sql = neon('postgresql://neondb_owner:npg_ABRkZgWrSw34@ep-floral-feather-aebzwqna-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require');
    const result = await sql`SELECT 1`;
    console.log('✅ Database connection successful:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}