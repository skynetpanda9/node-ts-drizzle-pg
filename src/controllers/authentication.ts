import express from "express";
import {db} from '../db/client'
import { getUserByEmail, createUser, updateUserById } from "../db/schema";
import { authentication, random } from "../helpers";

// Login Function
export const login = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.sendStatus(400);
      }

      const user = await getUserByEmail(email);

      if (!user) {
        return res.sendStatus(400);
      }

      const expectedHash = authentication(user.salt, password);

      if (user.password !== expectedHash) {
        return res.sendStatus(403);
      }

      const salt = random();
      const sessionToken = authentication(salt, user.id.toString());

      // Update the sessionToken in the database
      await updateUserById(user.id, { sessionToken });

      res.cookie("AKASH-AUTH", sessionToken, {
        domain: "localhost",
        path: "/",
      });

      return res.status(200).json(user).end();
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  };

  // Register Function
  export const register = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res.sendStatus(400);
      }

      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        return res.sendStatus(400);
      }

      const salt = random();
      const user = await createUser({
        email,
        username,
        salt,
        password: authentication(salt, password),
        sessionToken: "",
      });

      return res.status(200).json(user).end();
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  };
