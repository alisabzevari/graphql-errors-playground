import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql

interface ErrorData {
    correlationId: String
}

interface ErrorResponse {
    type: String!
    message: String
    data: ErrorData
}

type NotFoundError implements ErrorResponse {
    type: String!
    message: String
    data: ErrorData
}

type Supplier {
    id: String!
    name: String
}

type Query {
    supplier(id: String!): SupplierResponse
    suppliers: [Supplier!]!
}

union SupplierResponse = Supplier | NotFoundError
`;

const suppliers = [
  {
    id: "1",
    name: "Kate Chopin",
  },
  {
    id: "2",
    name: "Paul Auster",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  SupplierResponse: {
    __resolveType(obj, contextValue, info) {
      console.log(obj);
      if (obj.id) {
        return "Supplier";
      }

      return "NotFoundError";
    },
  },
  Query: {
    supplier(parent, args, contextValue, info) {
      const result = suppliers.find((supplier) => supplier.id === args.id);
      if (result) {
        return result;
      }
      return {
        type: "NOT_FOUND",
        message: "not found",
      };
    },
    suppliers() {
      return suppliers;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
