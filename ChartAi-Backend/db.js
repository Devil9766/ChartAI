import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs"

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl :{
    ca: fs.readFileSync("./ca.pem")
  }
});

console.log("✅ Database connected successfully.");

export default db;
