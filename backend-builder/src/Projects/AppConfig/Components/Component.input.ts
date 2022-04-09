import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { Component, DataSource } from "./Component.entity";

@InputType()
export class RequiredParameterInput {
  @Field((type) => ObjectIdScalar)
  entityType!: ObjectId;
  @Field()
  path!: string;
  @Field()
  label!: string;
}

@InputType()
export class DataSourceInput {
  @Field()
  entityType!: string;
  @Field()
  path!: string;
  @Field()
  label!: string;

  @Field((type) => [Object])
  variables!: Object[];
}

@InputType()
export class ComponentInput implements Partial<Component> {
  @Field({ nullable: true })
  type!: string;

  @Field({ nullable: true })
  package!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  x?: number;

  @Field({ nullable: true })
  y?: number;

  @Field((type) => Object, { nullable: true })
  props?: Object;

  @Field((type) => Object, { nullable: true })
  data?: Object;

  @Field({ nullable: true })
  isContainer!: boolean;

  @Field({ nullable: true })
  isRootElement!: boolean;

  @Field({ nullable: true })
  requiresAuth?: boolean;

  @Field((type) => [RequiredParameterInput], { nullable: true })
  parameters?: RequiredParameterInput[];

  @Field((type) => [DataSourceInput], { nullable: true })
  fetched?: DataSourceInput[];

  @Field((type) => ObjectIdScalar, { nullable: true })
  parent!: ObjectId;  

  @Field({ nullable: true })
  layerSort!: string;
}
