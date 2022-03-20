import { ObjectType, Field } from "type-graphql";
import { EntityModel } from "./Models/EntityModel.entity";
import {
  prop as Property,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { _id: false },
})
@ObjectType()
export class Api {
  @Field({ nullable: true })
  @Property({ nullable: true })
  sandboxEndpoint!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  liveEndpoint!: string;

  @Field((type) => [EntityModel])
  @Property({ type: () => EntityModel, default: [] })
  models!: EntityModel[];

  @Field((type) => [String])
  @Property({ default: [] })
  queries!: string[];

  @Field((type) => [String])
  @Property({ default: [] })
  mutations!: string[];

  @Field((type) => [String])
  @Property({ default: [] })
  subscriptions!: string[];
}
