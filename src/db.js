import mysql2 from 'mysql2';

const pool = mysql2.createPool(
    {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : "pokemon_db"
    }
).promise();

export default pool;