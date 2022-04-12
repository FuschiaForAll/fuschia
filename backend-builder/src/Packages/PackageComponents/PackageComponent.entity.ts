import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { prop as Property } from "@typegoose/typegoose";
import { PackageComponentType } from "./PackageComponentType.enum";

@ObjectType()
export class PackageComponent {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property({ required: true })
  name!: String;

  @Field((type) => PackageComponentType)
  @Property({ required: true, enum: PackageComponentType })
  componentType!: PackageComponentType;

  @Field((type) => Object)
  @Property({ required: true })
  schema!: any;

  @Field((type) => Object, { nullable: true })
  @Property()
  defaultValue!: Object;

  @Field()
  @Property({ required: true })
  icon!: String;
}
