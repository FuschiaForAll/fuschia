import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: `${process.env.REACT_APP_GQL_ENDPOINT}/graphql`,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
