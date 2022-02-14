const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/typeDefs.js");
const resolvers = require("./src/resolvers.js");
const setupDatabase = require("./src/setupDatabase.js");
const startLiveQuery = require("./src/startLiveQuery.js");

const startServer = async () => {
   const app = express();
   const apolloServer = new ApolloServer({ typeDefs, resolvers });

   await apolloServer.start();
   apolloServer.applyMiddleware({ app: app });

   app.use((req, res) => {
      res.send("Express Apollo Server");
   });

   let { client, pool } = await setupDatabase();

   startLiveQuery(pool);

   app.listen({ port: 4000 }, () =>
      console.log(
         `Server ready at http://localhost:4000${apolloServer.graphqlPath}`
      )
   );
};

startServer();
