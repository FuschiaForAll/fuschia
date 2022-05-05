import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DOCKERHUB_USERNAME) {
  throw new Error("DOCKERHUB_USERNAME is missing");
}

if (!process.env.DOCKERHUB_TOKEN) {
  throw new Error("DOCKERHUB_TOKEN is missing");
}

export const DOCKERHUB_USERNAME = process.env.DOCKERHUB_USERNAME
export const DOCKERHUB_TOKEN = process.env.DOCKERHUB_TOKEN
export const PORT = process.env.PORT ? +process.env.PORT : 3005