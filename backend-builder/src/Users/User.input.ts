import { Field, InputType } from "type-graphql";
import { User } from "./User.entity";

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  email!: string;

  @Field({ nullable: true })
  username!: string;

  @Field({ nullable: true })
  fullName!: string;
}
