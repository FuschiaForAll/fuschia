const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const { publish } = require("./schema.builder");
const { initialize } = require('./database.builder')
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');

(async () => {
  const mongoClient = new MongoClient(process.env.MONGO_DB_URL);
  await mongoClient.connect();
  const fuschiaDb = mongoClient.db("fuschia");
  const project = await fuschiaDb.collection("projects").find({ _id: new ObjectId(process.env.PROJECT_ID) }).toArray();
  if (project.length > 0) {
    const projectDb = mongoClient.db(process.env.PROJECT_ID);
    await initialize(projectDb, project[0])
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
            const token = jwt.sign({ username: payload.username, id: payload.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("token", token, {
              httpOnly: true,
              secure: false,
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
          } catch(e) {
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

  } else {
    throw new Error(`No project found with is ${process.env.PROJECT_ID}`)
  }
})();
