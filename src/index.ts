import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import { db } from './db/client';
import { users } from './db/schema';

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  console.log("Received request on /health endpoint");
  try {
    await db.select().from(users).limit(1);
    console.log("Database connection is healthy");
    res.status(200).send('Database connection is healthy');
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed');
  }
});

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server is running on http://192.168.1.118:4000/");
});
