import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";

@ObjectType()
export class Component {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property({ required: true })
  name!: String;

  @Field()
  @Property({ required: true })
  isRootElement!: boolean;

  @Field()
  @Property({ required: true })
  isContainer!: boolean;

  @Field()
  @Property({ required: true })
  schema!: String;

  @Field()
  @Property({ required: true })
  defaultValue!: String;

  @Field()
  @Property({ required: true })
  icon!: String;
}
