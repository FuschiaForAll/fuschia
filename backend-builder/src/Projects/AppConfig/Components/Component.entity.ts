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

@ObjectType()
export class DataMembers {
  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  type!: string;
}

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

@ObjectType()
export class DataSource {
  @Field()
  @Property()
  entityType!: string;

  @Field()
  @Property()
  path!: string;

  @Field()
  @Property()
  label!: string;

  @Field((type) => [Object])
  @Property({ default: [] })
  variables!: Object[];
}

@index({ parent: 1 })
@ObjectType()
export class Component {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

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

  @Field()
  @Property()
  isContainer!: boolean;

  @Field()
  @Property()
  isRootElement!: boolean;

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
  data?: Object;

  @Field((type) => Component, { nullable: true })
  @Property({ ref: () => Component })
  parent!: Ref<Component>;

  @Field((type) => [Component], { nullable: true })
  @Property({ ref: () => Component })
  children!: Ref<Component>[];
}
