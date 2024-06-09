import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  user: process.env.DB_USER as string || "your_db_user",
  password: process.env.DB_PASSWORD as string || "your_db_password",
  database: process.env.DB_NAME as string || "users",
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error:', err));

export const db = drizzle(client);
