import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { Component } from "./Component.entity";

@InputType()
export class ComponentInput implements Partial<Component> {
  @Field()
  name!: String;

  @Field((type) => Object)
  @Property({ required: true })
  schema!: Object;

  @Field((type) => Object)
  @Property({ required: true })
  defaultValue!: Object;

  @Field()
  isRootElement!: boolean;

  @Field()
  isContainer!: boolean;

  @Field()
  icon!: String;
}
