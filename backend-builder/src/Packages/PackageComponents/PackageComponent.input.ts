import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { PackageComponent } from "./PackageComponent.entity";

@InputType()
export class PackageComponentInput implements Partial<PackageComponent> {
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
