import { Client } from "pg";

async function createDatabase() {
  const client = new Client({
    user: "your_db_user",
    host: "localhost",
    password: "your_db_password",
    port: 5432,
  });

  try {
    await client.connect();
    await client.query("CREATE DATABASE users");
    console.log('Database "users" created successfully!');
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDatabase();

// if you wish to have a functionality to create db using util here it is.
// npx ts-node createDatabase.ts
// run above command if you want to create db using this file.
