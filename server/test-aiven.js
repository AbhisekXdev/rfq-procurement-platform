import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "LOADED" : "MISSING");

try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log("");
  console.log("=================================");
  console.log("✅ DIRECT MYSQL2 CONNECTION WORKS");
  console.log("=================================");

  const [rows] = await connection.query("SELECT 1 AS test");

  console.log("Query result:", rows);

  await connection.end();
  process.exit(0);
} catch (error) {
  console.log("");
  console.log("=================================");
  console.log("❌ DIRECT MYSQL2 CONNECTION FAILED");
  console.log("=================================");
  console.error(error);
  process.exit(1);
}