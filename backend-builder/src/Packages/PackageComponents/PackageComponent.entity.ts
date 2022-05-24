import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { modelOptions, prop as Property, Severity } from "@typegoose/typegoose";
import { PackageComponentType } from "./PackageComponentType.enum";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
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
  defaultPropValue!: Object;

  @Field((type) => Object, { nullable: true })
  @Property()
  defaultLayoutValue!: Object;

  @Field()
  @Property({ required: true })
  icon!: String;
}
