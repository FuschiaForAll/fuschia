import * as dotenv from "dotenv";
const packageJsonInfo = require("../../package.json");

dotenv.config();

type EmailClient = OAuthEmailClient | SimpleEmailClient;

interface OAuthEmailClient {
  type: "OAuth2";
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  expires: number;
}

interface SimpleEmailClient {
  type: "Simple";
  host: string;
  port: number;
  user: string;
  pass: string;
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing");
}
if (!process.env.MONGO_DB_URL) {
  throw new Error("MONGO_DB_URL is missing");
}
if (!process.env.DATABASE_NAME) {
  throw new Error("DATABASE_NAME is missing");
}
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}
if (!process.env.REDIS_PORT) {
  throw new Error("REDIS_PORT is missing");
}
if (!process.env.PORT) {
  throw new Error("PORT is missing");
}
if (!process.env.S3_ACCESS_KEY) {
  throw new Error("S3_ACCESS_KEY is missing");
}
if (!process.env.S3_SECRET) {
  throw new Error("S3_SECRET is missing");
}
if (!process.env.S3_BUCKET_NAME) {
  throw new Error("S3_BUCKET_NAME is missing");
}
if (!process.env.GITHUB_API_KEY) {
  throw new Error("GITHUB_API_KEY is missing");
}
let emailClient: EmailClient;
// email type could be mailtrap or google
if (process.env.EMAL_TYPE === "OAuth2") {
  if (!process.env.EMAL_TYPE) {
    throw new Error("TYPE is missing");
  }
  if (!process.env.EMAL_USER) {
    throw new Error("USER is missing");
  }
  if (!process.env.EMAL_CLIENT_ID) {
    throw new Error("CLIENT_ID is missing");
  }
  if (!process.env.EMAL_CLIENT_SECRET) {
    throw new Error("CLIENT_SECRET is missing");
  }
  if (!process.env.EMAL_REFRESH_TOKEN) {
    throw new Error("REFRESH_TOKEN is missing");
  }
  if (!process.env.EMAL_EXPIRES) {
    throw new Error("EXPIRES is missing");
  }

  emailClient = {
    type: "OAuth2",
    user: process.env.EMAL_USER,
    clientId: process.env.EMAL_CLIENT_ID,
    clientSecret: process.env.EMAL_CLIENT_SECRET,
    refreshToken: process.env.EMAL_REFRESH_TOKEN,
    expires: +process.env.EMAL_EXPIRES,
  };
} else {
  if (!process.env.EMAIL_HOST) {
    throw new Error("EMAIL_HOST is missing");
  }
  if (!process.env.EMAIL_PORT) {
    throw new Error("EMAIL_PORT is missing");
  }
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing");
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error("EMAIL_PASS is missing");
  }
  if (!process.env.APP_ENDPOINT) {
    throw new Error("APP_ENDPOINT is missing");
  }
  if (!process.env.FROM_EMAIL_ADDRESS) {
    throw new Error("FROM_EMAIL_ADDRESS is missing");
  }

  emailClient = {
    type: "Simple",
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  };
}
export const SERVER_VERSION = packageJsonInfo.version;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MONGO_DB_URL = process.env.MONGO_DB_URL;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_PORT = +process.env.REDIS_PORT;
export const PORT = +process.env.PORT;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
export const S3_SECRET = process.env.S3_SECRET;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const EMAIL_CLIENT = emailClient;
export const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
export const APP_ENDPOINT = process.env.APP_ENDPOINT;
export const GITHUB_API_KEY = process.env.GITHUB_API_KEY;
