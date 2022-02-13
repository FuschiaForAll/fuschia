import session from "express-session";
import connectRedis from "connect-redis";
import { REDIS_URL, MONGO_DB_URL, SESSION_SECRET } from "./utils/config";
import Redis from "ioredis"
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./Users/User.resolver";
import path from 'path' 
import { TypegooseMiddleware } from "./utils/typegoose-middleware";
import { ObjectIdScalar } from "./utils/object-id.scalar";
import { ObjectId } from "mongodb";
import { authChecker } from "./utils/auth-checker";
import { ApolloServer } from "apollo-server-express";
import { OrganizationResolver } from "./Organizations/Organization.resolver";
import { ProjectResolver } from "./Projects/Project.resolver";
import express from "express";
import passport from 'passport';
import { UserModel } from "./Models";
import cors from "cors";
import { v4 as uuid } from 'uuid';
import cookies from 'cookie-parser';
import { COOKIE_NAME } from "./consts";
import http from 'http'

(async () => {
  const redisStore = connectRedis(session)
  const redis = new Redis(REDIS_URL)

  const mongoose = await connect(MONGO_DB_URL)

  const schema = await buildSchema({
    resolvers: [UserResolver, OrganizationResolver, ProjectResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar}],
    validate: true,
    authChecker
  })

  
  passport.serializeUser((user: any, done) => {
    console.log('passport.serializeUser')
    console.log(user)
    
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: any, done) => {
    const matchingUser = await UserModel.findOne({
      id
    });
    done(null, matchingUser);
  });
  const app = express()
  
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "https://studio.apollographql.com",
      credentials: true,
    })
  )
  app.use(cookies())
  app.use((req, res, next) => {
    if (req.headers.authorization) {
      req.cookies[COOKIE_NAME] = req.headers.authorization
    }
    next()
  })
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
        secure: false,
        domain: process.env.NODE_ENV === "production" ? ".manyseeds.com" : undefined,
      },
      saveUninitialized: true,
      secret: SESSION_SECRET,
      resave: false,
    })
  );
  app.use(passport.initialize())
  app.use(passport.session())
  
  const context = async ({ req, res }: any) => ({
    getUser: () => req.user,
    logout: () => req.logout(),
    req,
    res,
    redis,
  })
  const apolloServer = new ApolloServer({ schema, context })  
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "https://studio.apollographql.com",
      credentials: true,
      
    },
  });
  const server = http.createServer(app)
  server.listen(4000, () => {
    console.log(`Server is running on port 4000`)
  })
})().catch(err => console.error(err))

