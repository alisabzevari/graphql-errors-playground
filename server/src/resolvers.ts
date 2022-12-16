import { db } from "./db";

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
  SupplierUnionResponse: {
    __resolveType(obj, contextValue, info) {
      console.log(obj);
      if (obj.id) {
        return "Supplier";
      }

      return "NotFoundError";
    },
  },
  Query: {
    supplierUnion(parent, args, contextValue, info) {
      const result = db.suppliers.find((supplier) => supplier.id === args.id);
      if (result) {
        return result;
      }

      return {
        type: "NOT_FOUND",
        message: "not found",
      };
    },
  },
};
