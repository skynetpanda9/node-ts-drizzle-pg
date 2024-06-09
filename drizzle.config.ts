import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT as string, 10) || 5432,
        user: process.env.DB_USER as string || "pi",
        password: process.env.DB_PASSWORD as string || "your_db_password",
        database: process.env.DB_NAME as string || "users",
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
