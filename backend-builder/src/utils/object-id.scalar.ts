import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string | null {
    if (!value) { return null }
    if (!(value instanceof ObjectId)) {
      console.log(`ObjectIdScalar`)
      console.log(value)
      throw new Error("ObjectIdScalar can only serialize ObjectId values");
    }
    return value.toHexString();
  },
  parseValue(value: unknown): ObjectId {
    if (typeof value !== "string") {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(value);
  },
  parseLiteral(ast): ObjectId {
    if (ast.kind !== Kind.STRING) {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(ast.value);
  },
});