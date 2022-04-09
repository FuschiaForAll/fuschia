import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import {
  index,
  modelOptions,
  prop as Property,
  Ref,
  Severity,
} from "@typegoose/typegoose";

@index({ parent: 1 })
@ObjectType()
export class Stack {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Property()
  readonly projectId!: ObjectId;

  @Field()
  @Property()
  name!: String;

  @Field((type) => [ObjectIdScalar])
  @Property({ default: [] })
  children!: ObjectId[];
}
