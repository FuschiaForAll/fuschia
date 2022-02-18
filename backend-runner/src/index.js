const { ApolloServer, gql } = require('apollo-server');
const { publish } = require('./schema.builder');
const { MongoClient } = require('mongodb');

(async() => {
  const mongoClient = new MongoClient(process.env.MONGO_DB_URL)
  await mongoClient.connect();
  const db = mongoClient.db('fuschia')
  const project = await db.collection('projects').find({}).toArray()
  const { typeDefs, resolvers } = publish(project[0])
  console.log(typeDefs)
  const server = new ApolloServer({ cors: { origin: 'http://localhost:3000' }, debug: true, typeDefs: gql`${typeDefs}`, resolvers });
  server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})()