import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { Package } from "./Package.entity";
import { PackageScope } from "./PackageScope.enum";
import { ComponentInput } from "../Component/Component.input";

@InputType()
export class PackageInput {
  @Field()
  packageName!: String;

  @Field()
  @Property({ required: true, unique: true })
  repositoryUrl!: String;

  @Field()
  version!: String;

  @Field()
  bundle!: String;

  @Field((type) => [ComponentInput])
  components!: ComponentInput[];

  @Field((type) => ObjectIdScalar)
  authorId!: ObjectId;

  @Field((type) => PackageScope)
  scope!: PackageScope;
}
