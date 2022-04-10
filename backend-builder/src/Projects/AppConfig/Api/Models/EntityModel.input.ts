
import { Matches } from "class-validator";
import { Field, InputType } from "type-graphql";
import { EntityModel } from "./EntityModel.entity";

@InputType()
export class EntityModelInput implements Partial<EntityModel> {
  @Field({ nullable: true })
  @Matches('^[a-zA-Z_$][a-zA-Z_$0-9]*$')
  name!: string;

  @Field({ nullable: true })
  isLocal!: boolean;
}