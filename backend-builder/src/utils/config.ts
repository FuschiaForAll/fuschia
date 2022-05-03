import * as dotenv from "dotenv";
import { config } from "process";
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

export const requiredConfigVars: {
  //The key used in the env file
  key: string,
  //A custom error message if you want
  message?: string,
  //Used to only allowed certain options in the env variable ("simple" or "oauth2" for example)
  options?: {
    //The actual value ("simple" in the above example")
    value: string,
    //Other config fields that are required ONLY if this option is chosen. For eg. if "simple", then "EMAIL_USER" config key is a required dependency
    dependencies?: string[]
  }[]
}[] = [
    { key: "SESSION_SECRET", message: "Missing SESSION_SECRET" },
    { key: "MONGO_DB_URL" },
    { key: "DATABASE_NAME" },
    { key: "REDIS_URL" },
    { key: "REDIS_PORT" },
    { key: "PORT" },
    { key: "S3_ACCESS_KEY" },
    { key: "S3_SECRET" },
    { key: "S3_BUCKET_NAME" },
    { key: "FROM_EMAIL_ADDRESS" },
    { key: "APP_ENDPOINT" },
    {
      key: "EMAIL_TYPE", options: [
        { value: "OAuth2", dependencies: ["EMAIL_USER", "EMAIL_CLIENT_ID", "EMAIL_CLIENT_SECRET", "EMAIL_REFRESH_TOKEN", "EMAIL_EXPIRES"] },
        { value: "Simple", dependencies: ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"] }
      ]
    }
  ];

//looped validation for the array of required items above. Think this is a bit cleaner than having numerous lines of `if(...) throw new Error`
let errors: string[] = [];
for (const conf of requiredConfigVars) {
  if (!process.env[conf.key]) {
    errors.push((conf.message ? conf.message : `Missing Environment Variable: ${conf.key}`));
    continue;
  }
  if (conf.options) {
    const filtered = conf.options.filter(item => item.value.toLowerCase() === process.env[conf.key]?.toLowerCase());
    if (!filtered.length) {
      errors.push((conf.message ? conf.message : `Invalid value for environment variable: ${conf.key}`));
    } else {
      if (filtered[0].dependencies) {
        filtered[0].dependencies.forEach(subConf => {
          if (!process.env[subConf]) {
            errors.push(`Missing Environment Variable: ${subConf}`);
          }
        });
      }
    }
  }
}
if (errors.length > 0) {
  throw new Error(errors.join("\r\n"));
}


let emailClient: EmailClient;
// email type could be mailtrap or google
if (process.env.EMAIL_TYPE!.toLowerCase() === "oauth2") {
  emailClient = {
    type: "OAuth2",
    user: process.env.EMAIL_USER!,
    clientId: process.env.EMAIL_CLIENT_ID!,
    clientSecret: process.env.EMAIL_CLIENT_SECRET!,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN!,
    expires: +process.env.EMAIL_EXPIRES!,
  };
} else {
  emailClient = {
    type: "Simple",
    host: process.env.EMAIL_HOST!,
    port: +process.env.EMAIL_PORT!,
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  };
}
export const SERVER_VERSION = packageJsonInfo.version;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const MONGO_DB_URL = process.env.MONGO_DB_URL!;
export const DATABASE_NAME = process.env.DATABASE_NAME!;
export const REDIS_URL = process.env.REDIS_URL!;
export const REDIS_PORT = +process.env.REDIS_PORT!;
export const PORT = +process.env.PORT!;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY!;
export const S3_SECRET = process.env.S3_SECRET!;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
export const EMAIL_CLIENT = emailClient;
export const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS!;
export const APP_ENDPOINT = process.env.APP_ENDPOINT!;
