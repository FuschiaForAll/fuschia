import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { DataSource } from "./Component.entity";

@InputType()
export class DataSourceInput {
  @Field()
  type!: string;

  @Field((type) => [String])
  variables!: string[];
}

@InputType()
export class ComponentInput {
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

  @Field({ nullable: true })
  props?: string;

  @Field({ nullable: true })
  isContainer!: boolean;

  @Field({ nullable: true })
  isRootElement!: boolean;

  @Field((type) => [String], { nullable: true })
  parameters?: string[];

  @Field((type) => [DataSourceInput], { nullable: true })
  fetched?: DataSourceInput[];

  @Field((type) => ObjectIdScalar, { nullable: true })
  parent!: ObjectId;

  @Field((type) => [ObjectIdScalar], { nullable: true })
  children!: ObjectId[];
}
