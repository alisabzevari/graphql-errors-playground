import { db } from "./db";
import { GraphQLError } from "graphql";
// import { ApolloServerErrorCode } from "@apollo/server/errors";

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
  UserUnionResponse: {
    __resolveType(obj, contextValue, info) {
      return obj.__typename;
    },
  },
  Query: {
    userUnion(parent, args, contextValue, info) {
      if (args.id === "3") {
        return {
          __typename: "UserIsBusy",
          type: "UserIsBusy",
          message: "User is really busy!",
          reason: "PERSONAL_REASONS",
        };
      }

      const result = db.users.find((user) => user.id === args.id);
      if (result) {
        return {
          __typename: "User",
          ...result,
        };
      }

      return {
        __typename: "NotFoundError",
        type: "NOT_FOUND",
        message: "not found",
      };
    },

    userResult(parent, args, contextValue, info) {
      if (args.id === "3") {
        return {
          type: "ERROR",
          error: {
            __typename: "UserIsBusy",
            type: "UserIsBusy",
            message: "User is really busy!",
            reason: "PERSONAL_REASONS",
          },
        };
      }

      const result = db.users.find((user) => user.id === args.id);
      if (result) {
        return {
          type: "SUCCESS",
          success: {
            __typename: "Supplier",
            ...result,
          },
        };
      }

      return {
        type: "ERROR",
        error: {
          __typename: "NotFoundError",
          type: "NOT_FOUND",
          message: "not found",
        },
      };
    },

    user(parent, args, contextValue, info) {
      if (args.id === "3") {
        throw new GraphQLError("User us really busy!", {
          extensions: {
            reason: "PERSONAL_REASONS",
            code: "UserIsBusy",
          },
        });
      }

      const result = db.users.find((user) => user.id === args.id);
      if (result) {
        return result;
      }

      throw new GraphQLError("not found", {
        extensions: { code: "NOT_FOUND" },
      });
    },
  },
};
