import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { Package } from "./Package.entity";
import { PackageScope } from "./PackageScope.enum";
import { PackageComponentInput } from "./PackageComponents/PackageComponent.input";

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

  @Field((type) => [PackageComponentInput])
  components!: PackageComponentInput[];

  @Field((type) => ObjectIdScalar)
  authorId!: ObjectId;

  @Field((type) => PackageScope)
  scope!: PackageScope;
}
