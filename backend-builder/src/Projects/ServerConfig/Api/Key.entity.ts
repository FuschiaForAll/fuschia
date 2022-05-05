import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { Ref } from "../../../utils/ref-type";
import { DataField } from "./Fields/DataField.entity";

enum AuthStrategy { owner, groups, private, public }
enum AuthProvider { apiKey, iam, oidc, userPools }
enum ModelOperation { create, update, delete, read }

@ObjectType()
export class Key {
  @Field()
  name!: String
  
  @Field(type => [String])
  fieldNames!: string[]
}