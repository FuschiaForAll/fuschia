import 'reflect-metadata'
import { ApolloServer } from "apollo-server";
import path from "path";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { PORT } from "./config";
import { ServerBuilderResolver } from "./graphql/server-builder.resolver";
import { AppBuilderResolver } from './graphql/app-builder.resolver';
import { GraphQLJSONObject } from 'graphql-type-json';

(async () => {
    const schema = await buildSchema({
      resolvers: [
        AppBuilderResolver,
        ServerBuilderResolver
      ],
      emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
      container: Container,
      scalarsMap: [
        { type: Object, scalar: GraphQLJSONObject },
      ],
    })

    const server = new ApolloServer({
      schema
    })
    await server.listen({ port: PORT })
    console.log('server is up')
})();
