import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client/core";
import fetch from "cross-fetch";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    fetch,
    uri: "http://localhost:4000/",
  }),
});

client
  .query({
    query: gql`
      query GetUserQuery {
        user(id: "4") {
          id
          name
        }
      }
    `,
  })
  .then((result) => console.log(result))
  .catch((err) => {
    console.log(err);
  });
