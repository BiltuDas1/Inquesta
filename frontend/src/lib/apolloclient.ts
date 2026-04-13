import { HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_API_URL,
  }),
  cache: new InMemoryCache(),
});

console.log("DEBUG: GQL URL is:", import.meta.env.VITE_API_URL);
