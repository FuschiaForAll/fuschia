import 'reflect-metadata'
import { ApolloServer } from "apollo-server";
import path from "path";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { PORT } from "./config";
import { ServerResolver } from "./server.resolver";

(async () => {
    const schema = await buildSchema({
      resolvers: [
        ServerResolver
      ],
      emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
      container: Container,
    })

    const server = new ApolloServer({
      schema
    })
    await server.listen({ port: PORT })
    console.log('server is up')
})();
