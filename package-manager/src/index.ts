
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { ComponentResolver } from "./Component/Component.resolver";
import { MONGO_DB_URL } from "./utils/config";
import path from "path";
import { TypegooseMiddleware } from "./utils/typegoose-middleware";
import { ObjectIdScalar } from "./utils/object-id.scalar";
import { ObjectId } from "mongodb";
import { Container } from "typedi";
import { ApolloServer } from "apollo-server";
import { PackageResolver } from "./Package/Package.resolver";

(async () => {
  const mongoose = await connect(MONGO_DB_URL, { dbName: "fuschia" });

  const schema = await buildSchema({
    resolvers: [
      PackageResolver,
      ComponentResolver
    ],
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    validate: true,
    container: Container
  });

  const server = new ApolloServer({
    schema,
    cors: {
      origin: '*'
    }
  });

  const { url } = await server.listen(4006);
  console.log(`Server is running, GraphQL Playground available at ${url}`);

})()