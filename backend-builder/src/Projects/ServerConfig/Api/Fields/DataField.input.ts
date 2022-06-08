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

@InputType()
export class DataFieldUpdateInput implements Partial<DataField> {
  @Field({nullable: true})
  isUnique?: boolean;

  @Field({nullable: true})
  isHashed?: boolean;

  @Field({nullable: true})
  isList?: boolean;

  @Field({nullable: true})
  nullable?: boolean;

  @Field({nullable: true})
  dataType?: string;
}