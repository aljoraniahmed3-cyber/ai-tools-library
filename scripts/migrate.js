require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('Starting database migrations...');

    // Read and execute schema SQL
    const schemaPath = path.join(__dirname, '../lib/db/schema.ts');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Extract SQL from TypeScript
    const sqlMatch = schemaContent.match(/`([\s\S]*)`/);
    if (!sqlMatch) {
      throw new Error('Could not extract SQL from schema file');
    }

    const sql = sqlMatch[1];
    const statements = sql.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
        console.log('✓ Executed statement');
      }
    }

    console.log('✓ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
