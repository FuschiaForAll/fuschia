
import { Field, InputType } from "type-graphql";
import { Organization } from "./Organization.entity";

@InputType()
export class OrganizationInput implements Partial<Organization> {
  @Field()
  name!: string;
}