import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { Component } from "./Component.entity";

@InputType()
export class ComponentInput implements Partial<Component> {
  @Field()
  name!: String;

  @Field()
  props!: String;

  @Field()
  isRootElement!: boolean;

  @Field()
  icon!: String;
}
