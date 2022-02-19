const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const { publish } = require("./schema.builder");
const { MongoClient } = require("mongodb");
const jwt = require('jsonwebtoken');

(async () => {
  const mongoClient = new MongoClient(process.env.MONGO_DB_URL);
  await mongoClient.connect();
  const db = mongoClient.db("fuschia");
  const project = await db.collection("projects").find({}).toArray();
  const { typeDefs, resolvers } = publish(project[0]);
  const server = new ApolloServer({
    cors: { origin: "http://localhost:3000" },
    debug: true,
    typeDefs: gql`
      ${typeDefs}
    `, 
    resolvers,
    context: async({ req, res, connection }) => {
      const retContext = { req, res };
      if (!req || !req.headers) {
        return connection.context
      }
      require('cookie-parser')()(req, res, () => {});
      if (req.cookies && req.cookies.token) {
        try {
          const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
          retContext.userInfo = payload
          if (new Date() >= new Date(payload.exp * 1000)) {
            res.clearCookie("token");
            throw new AuthenticationError(
              "Authentication token is invalid, please log in"
            );
          }
          const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
        } catch {
          res.clearCookie("token");
          throw new AuthenticationError(
            "Authentication token is invalid, please log in"
          );
        }
      }
      return retContext
    }
  });
  server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
