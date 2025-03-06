import { config } from 'dotenv';
config();

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const CLIENT_URL = process.env.CLIENT_URL;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const MAPS_API_KEY = process.env.MAPS_API_KEY;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const MODEL_NAME = process.env.MODEL_NAME;

export {
  PORT,
  CLIENT_URL,
  MONGO_URI,
  SESSION_SECRET,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  MAPS_API_KEY,
  GITHUB_TOKEN,
  AZURE_ENDPOINT,
  MODEL_NAME,
  NODE_ENV,
};
