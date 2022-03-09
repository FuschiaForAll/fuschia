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
  props?: string;

  @Field((type) => Component, { nullable: true })
  @Property({ ref: () => Component })
  parent!: Ref<Component>;

  @Field((type) => [Component], { nullable: true })
  @Property({ ref: () => Component })
  children!: Ref<Component>[];
}
