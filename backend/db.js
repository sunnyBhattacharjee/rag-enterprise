import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'enterprise_rag',
    password: 'admin', 
    port: 5432,
});

export default pool;