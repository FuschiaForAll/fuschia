import { ObjectType, Field, InputType } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";

@InputType()
export class ComponentInput {
  @Field({ nullable: true })
  type!: string;

  @Field({ nullable: true })
  package!: string;

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

  @Field((type) => ObjectIdScalar, { nullable: true })
  parent!: ObjectId;

  @Field((type) => [ObjectIdScalar], { nullable: true })
  children!: ObjectId[];
}
