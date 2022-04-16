import { ObjectType, Field } from "type-graphql";
import mongoose, { ObjectId } from "mongoose";
import {
  modelOptions,
  prop as Property,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { ObjectIdScalar } from "../../../../../utils/object-id.scalar";

@ObjectType()
export class Asset {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  key!: string;
}
