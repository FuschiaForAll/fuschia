import session from "express-session";
import connectRedis from "connect-redis";
import {
  REDIS_URL,
  MONGO_DB_URL,
  SESSION_SECRET,
  REDIS_PORT,
  S3_ACCESS_KEY,
  S3_SECRET,
  S3_REGION,
  HTTP_PORT,
  HTTPS_PORT,
  DATABASE_NAME,
  APP_ENDPOINT
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
import express, { json } from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import cookies from "cookie-parser";
import { COOKIE_NAME } from "./consts";
import https from "https";
import { Container } from "typedi";
import { EntityModelResolver } from "./Projects/ServerConfig/Api/Models/EntityModel.resolver";
import { DataFieldResolver } from "./Projects/ServerConfig/Api/Fields/DataField.resolver";
import { ApiResolver } from "./Projects/ServerConfig/Api/Api.resolver";
import fs from "fs";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { AuthResolver } from "./Projects/ServerConfig/Auth/Auth.resolver";
import { ComponentResolver } from "./Projects/AppConfig/Components/Component.resolver";
import { LabelLibraryResolver } from "./Projects/AppConfig/Libraries/LabelLibrary/LabelLibrary.resolver";
import { GraphQLJSONObject } from "graphql-type-json";
import { AppConfigResolver } from "./Projects/AppConfig/AppConfig.resolver";
import { PackageResolver } from "./Packages/Package.resolver";
import { PackageComponentResolver } from "./Packages/PackageComponents/PackageComponent.resolver";
import { PreviewerResolver } from "./Previewer/Previewer.resolver";
import { AssetLibraryResolver } from "./Projects/AppConfig/Libraries/ImageLibrary/AssetLibrary.resolver";
import { graphqlUploadExpress } from "graphql-upload";
import { S3Uploader } from "./utils/s3-uploader";
import { AssetResolver } from "./Projects/AppConfig/Libraries/ImageLibrary/ImageFile/Asset.resolver";
import { InvitationResolver } from "./Invitations/Invitation.resolver";
import AWS from "aws-sdk";
import { ServerResolver } from "./Projects/ServerConfig/Server.resolver";

const key = fs.readFileSync(path.join(__dirname, "./cert/localhost.key"));
const cert = fs.readFileSync(path.join(__dirname, "./cert/localhost.crt"));

(async () => {

  const credentials = new AWS.Credentials(S3_ACCESS_KEY, S3_SECRET);
  AWS.config.credentials = credentials;
  AWS.config.region = S3_REGION;

  const redisStore = connectRedis(session);
  const redis = new Redis(`${REDIS_URL}:${REDIS_PORT}`);

  const mongoose = await connect(MONGO_DB_URL, { dbName: DATABASE_NAME });
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
      PreviewerResolver,
      AssetLibraryResolver,
      AssetResolver,
      InvitationResolver,
      ServerResolver
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
  app.use(json({ limit: "2mb" }));
  app.use(
    cors({
      origin: APP_ENDPOINT,
      credentials: true,
    })
  );
  app.use(cookies());

  app.use(graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 10 }));

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

  app.get(`/project-files/*`, async (req, res) => {
    const fileKey = decodeURI(req.path.replace("/project-files/", ""));
    const uploader = Container.get(S3Uploader);
    const file = uploader.getFile(fileKey, res);
  });

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
      origin: APP_ENDPOINT,
      credentials: true,
    },
  });
  const server = https.createServer({ key: key, cert: cert }, app);
  server.listen(HTTPS_PORT, () => {
    console.log(`\x1b[36m[Express]\x1b[0m >> HTTPS Server is running on port ${HTTPS_PORT}`);
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams: string) => {
          const userSession = await redis.get(`sess:${connectionParams}`);
          //console.log(userSession);
          if (userSession) {
            const payload = JSON.parse(userSession);
            //console.log(payload);
            return { userId: payload.userId };
          }
          return null;
        },
      },
      {
        server,
        path: "/subscriptions",
      }
    );
  });
  app.listen(HTTP_PORT, () => {
    console.log(`\x1b[36m[Express]\x1b[0m >> HTTP Server is running on port ${HTTP_PORT}`);
  });
})().catch((err) => console.error(err));
