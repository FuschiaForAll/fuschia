
import { Field, InputType } from "type-graphql";
import { EntityModel } from "./EntityModel.entity";

@InputType()
export class EntityModelInput implements Partial<EntityModel> {
  @Field()
  name!: string;
}