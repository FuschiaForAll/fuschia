import session from "express-session";
import connectRedis from "connect-redis";
import {
  REDIS_URL,
  MONGO_DB_URL,
  SESSION_SECRET,
  REDIS_PORT,
} from "./utils/config";
import Redis from "ioredis";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./Users/User.resolver";
import path from "path";
import { TypegooseMiddleware } from "./utils/typegoose-middleware";
import { ObjectIdScalar } from "./utils/object-id.scalar";
import { ObjectId } from "mongodb";
import { authChecker } from "./utils/auth-checker";
import { ApolloServer } from "apollo-server-express";
import { OrganizationResolver } from "./Organizations/Organization.resolver";
import { ProjectResolver } from "./Projects/Project.resolver";
import express from "express";
import { UserModel } from "./Models";
import cors from "cors";
import { v4 as uuid } from "uuid";
import cookies from "cookie-parser";
import { COOKIE_NAME } from "./consts";
import https from "https";
import { Container } from "typedi";
import { EntityModelResolver } from "./Projects/AppConfig/Api/Models/EntityModel.resolver";
import { DataFieldResolver } from "./Projects/AppConfig/Api/Fields/DataField.resolver";
import { ApiResolver } from "./Projects/AppConfig/Api/Api.resolver";
import fs from "fs";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { AuthResolver } from "./Projects/AppConfig/Auth/Auth.resolver";
import { ComponentResolver } from "./Projects/AppConfig/Components/Component.resolver";
import { LabelLibraryResolver } from "./Projects/AppConfig/Libraries/LabelLibrary/LabelLibrary.resolver";
import { GraphQLJSONObject } from "graphql-type-json";
import { AppConfigResolver } from "./Projects/AppConfig/AppConfig.resolver";
import { PackageResolver } from "./Packages/Package.resolver";
import { PackageComponentResolver } from "./Packages/PackageComponents/PackageComponent.resolver";

const key = fs.readFileSync(path.join(__dirname, "./cert/key.pem"));
const cert = fs.readFileSync(path.join(__dirname, "./cert/cert.pem"));

(async () => {
  const redisStore = connectRedis(session);
  const redis = new Redis(`${REDIS_URL}:${REDIS_PORT}`);

  const mongoose = await connect(MONGO_DB_URL, { dbName: "fuschia" });
  const options = {
    host: REDIS_URL,
    port: REDIS_PORT,
    retryStrategy: (times: number) => {
      return Math.min(times * 50, 2000);
    },
  };
  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      OrganizationResolver,
      ProjectResolver,
      EntityModelResolver,
      DataFieldResolver,
      ApiResolver,
      AuthResolver,
      ComponentResolver,
      LabelLibraryResolver,
      AppConfigResolver,
      PackageResolver,
      PackageComponentResolver,
    ],
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: Object, scalar: GraphQLJSONObject },
    ],
    validate: true,
    authChecker,
    container: Container,
    pubSub,
  });

  const app = express();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookies());
  app.use(
    session({
      genid: (req) => uuid(),
      name: COOKIE_NAME,
      store: new redisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "none", // csrf
        secure: true,
        domain:
          process.env.NODE_ENV === "production" ? "fuschia.com" : undefined,
      },
      saveUninitialized: true,
      secret: SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      return {
        getUser: () => req.user,
        logout: () => req.logout(),
        req,
        res,
        redis,
      };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  const server = https.createServer({ key: key, cert: cert }, app);
  server.listen(4003, () => {
    console.log(`Server is running on port 4003`);
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams: any) => {},
      },
      {
        server,
      }
    );
  });
  app.listen(4002, () => {
    console.log(`Server is running on port 4002`);
  });
})().catch((err) => console.error(err));
