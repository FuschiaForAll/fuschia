import * as dotenv from 'dotenv'
const packageJsonInfo = require('../../package.json')

dotenv.config();

if (!process.env.SESSION_SECRET) { throw new Error('SESSION_SECRET is missing')}
if (!process.env.MONGO_DB_URL) { throw new Error('MONGO_DB_URL is missing')}
if (!process.env.DATABASE_NAME) { throw new Error('DATABASE_NAME is missing')}
if (!process.env.REDIS_URL) { throw new Error('REDIS_URL is missing')}
if (!process.env.PORT) { throw new Error('PORT is missing')}

export const SERVER_VERSION = packageJsonInfo.version
export const SESSION_SECRET = process.env.SESSION_SECRET
export const MONGO_DB_URL = process.env.MONGO_DB_URL
export const DATABASE_NAME = process.env.DATABASE_NAME
export const REDIS_URL = process.env.REDIS_URL
export const PORT = +process.env.PORT
