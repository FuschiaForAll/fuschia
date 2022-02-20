import { Field, InputType } from "type-graphql";
import { DataField } from "./DataField.entity";

@InputType()
export class DataFieldInput implements Partial<DataField> {
  @Field()
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