import { ObjectType, Field } from "type-graphql";
import mongoose, { ObjectId } from "mongoose";
import {
  modelOptions,
  prop as Property,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { Asset } from "./ImageFile/AssetFile.entity";

@ObjectType()
export class AssetLibrary {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Property()
  readonly projectId!: ObjectId;

  @Field((type) => [Asset])
  @Property({ default: [] })
  assets!: ObjectId[];
}
