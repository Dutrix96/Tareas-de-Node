import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import authJwt from "../middlewares/authJwt.js";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

export const initGraphQL = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    authJwt,
    expressMiddleware(server, {
      context: async ({ req }) => {
        return { user: req.user };
      },
    })
  );

  console.log("GraphQL listo en /graphql");
};
