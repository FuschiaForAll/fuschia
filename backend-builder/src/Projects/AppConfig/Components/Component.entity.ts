import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import {
  index,
  modelOptions,
  prop as Property,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { PackageComponentType } from "../../../Packages/PackageComponents/PackageComponentType.enum";


@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class DataMembers {
  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  type!: string;
}


@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class RequiredParameter {
  @Field((type) => ObjectIdScalar)
  readonly _id?: ObjectId;

  @Field((type) => ObjectIdScalar)
  @Property()
  entityType!: ObjectId;

  @Field()
  @Property()
  path!: string;

  @Field()
  @Property()
  label!: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class DataSource {
  @Field((type) => Object)
  @Property()
  entityType!: Object;

  @Field((type) => [Object])
  @Property({ default: [] })
  variables!: Object[];
}

@index({ parent: 1 })
@ObjectType()
export class Component {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Property()
  projectId!: ObjectId;

  @Field()
  @Property()
  package!: string;

  @Field()
  @Property()
  type!: string;

  @Field()
  @Property()
  name!: string;

  @Field({ nullable: true })
  @Property()
  x?: number;

  @Field({ nullable: true })
  @Property()
  y?: number;

  @Field((type) => PackageComponentType)
  @Property({ required: true, enum: PackageComponentType })
  componentType!: PackageComponentType;

  @Field({ nullable: true })
  @Property()
  requiresAuth?: boolean;

  @Field((type) => [RequiredParameter], { nullable: true })
  @Property({ type: () => RequiredParameter })
  parameters?: RequiredParameter[];

  @Field((type) => [DataSource], { nullable: true })
  @Property({ type: () => DataSource, default: [] })
  fetched?: DataSource[];

  @Field((type) => Object, { nullable: true })
  @Property()
  props?: Object;

  @Field((type) => Object, { nullable: true })
  @Property()
  layout?: Object;

  @Field((type) => Object, { nullable: true })
  @Property()
  data?: Object;

  @Field((type) => ObjectIdScalar, { nullable: true })
  @Property()
  parent?: ObjectId;

  @Field()
  @Property()
  layerSort!: string;
}
