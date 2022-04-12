import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { PackageComponent } from "./PackageComponent.entity";
import { PackageComponentType } from "./PackageComponentType.enum";

@InputType()
export class PackageComponentInput implements Partial<PackageComponent> {
  @Field()
  name!: String;

  @Field((type) => Object)
  schema!: Object;

  @Field((type) => Object)
  defaultValue!: Object;

  @Field((type) => PackageComponentType)
  componentType!: PackageComponentType;

  @Field()
  icon!: String;
}
