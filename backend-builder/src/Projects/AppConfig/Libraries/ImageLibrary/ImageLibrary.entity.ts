import { ObjectType, Field } from "type-graphql";
import mongoose, { ObjectId } from "mongoose";
import {
  modelOptions,
  prop as Property,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { ImageFile } from "./ImageFile/ImageFile.entity";

@ObjectType()
export class ImageLibrary {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Property()
  readonly projectId!: ObjectId;

  @Field((type) => [ImageFile])
  @Property({ ref: () => ImageFile, default: [] })
  images!: ImageFile[];
}
