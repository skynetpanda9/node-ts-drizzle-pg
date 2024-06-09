import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { db } from './client'
import { eq } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  salt: text("salt").default(''), // Default to empty string
  sessionToken: text("session_token").default(''), // Default to empty string
});

export type User = {
  id: number;
  email: string;
  username: string;
  password: string;
  salt: string; // Always a string
  sessionToken: string; // Always a string
};

export type NewUser = Omit<User, 'id'>;

// abstractions
export const getUsers = async (): Promise<User[]> => {
  const results = await db.select().from(users).execute();
  return results.map(user => ({
    ...user,
    salt: user.salt ?? '',
    sessionToken: user.sessionToken ?? '',
  }));
};

export const getUserBySessionToken = async (sessionToken: string): Promise<User | undefined> => {
  const results = await db.select().from(users).where(eq(users.sessionToken, sessionToken)).execute();

  if (results.length === 0) {
    return undefined;
  }

  const user = results[0];
  return {
    ...user,
    salt: user.salt ?? '',
    sessionToken: user.sessionToken ?? '',
  };
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const results = await db.select().from(users).where(eq(users.id, id)).execute();

  if (results.length === 0) {
    return undefined;
  }

  const user = results[0];
  return {
    ...user,
    salt: user.salt ?? '',
    sessionToken: user.sessionToken ?? '',
  };
};

export const deleteUserById = async (id: number): Promise<void> => {
  await db.delete(users).where(eq(users.id, id)).execute();
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const results = await db.select().from(users).where(eq(users.email, email)).execute();

  if (results.length === 0) {
    return undefined;
  }

  const user = results[0];
  return {
    ...user,
    salt: user.salt ?? '',
    sessionToken: user.sessionToken ?? '',
  };
};

export const createUser = async (values: NewUser): Promise<User> => {
  const newUserArray = await db.insert(users).values(values).returning({
    id: users.id,
    email: users.email,
    username: users.username,
    password: users.password,
    salt: users.salt,
    sessionToken: users.sessionToken,
  }).execute();

  const newUser = newUserArray[0];

  return {
    ...newUser,
    salt: newUser.salt || '',
    sessionToken: newUser.sessionToken || '',
  };
};

export const updateUserById = async (id: number, values: Partial<User>): Promise<void> => {
  await db.update(users).set(values).where(eq(users.id, id)).execute();
};