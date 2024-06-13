const mysql = require('mysql2/promise');
require('dotenv').config();

const db = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('DB connected');
        return connection;
    } catch (error) {
        console.log('DB connection error', error);
        throw error;
    }
};

module.exports = { db };
