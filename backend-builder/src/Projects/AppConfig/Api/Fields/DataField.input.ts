import { Matches } from "class-validator";
import { Field, InputType } from "type-graphql";
import { DataField } from "./DataField.entity";

@InputType()
export class DataFieldInput implements Partial<DataField> {
  @Field()
  @Matches('^[a-zA-Z_$][a-zA-Z_$0-9]*$')
  fieldName!: string;

  @Field()
  isUnique!: boolean;

  @Field()
  isHashed!: boolean;

  @Field()
  isList!: boolean;

  @Field()
  nullable!: boolean;

  @Field()
  dataType!: string;
}