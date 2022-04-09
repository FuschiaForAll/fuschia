import { InputType, Field } from "type-graphql";

@InputType()
export class StackInput {
  @Field({ nullable: true })
  name?: string;
}
