import 'dotenv/config';
import mysql from 'mysql2/promise';

// Zona waktu aplikasi (WIB / Asia/Jakarta). Ubah lewat .env jika perlu.
const APP_TIMEZONE = process.env.APP_TIMEZONE || '+07:00';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  timezone: APP_TIMEZONE, // mysql2 memakai offset ini saat menulis/membaca DATETIME
  dateStrings: true,      // kembalikan DATETIME/TIMESTAMP sebagai string apa adanya (tanpa konversi Date)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;