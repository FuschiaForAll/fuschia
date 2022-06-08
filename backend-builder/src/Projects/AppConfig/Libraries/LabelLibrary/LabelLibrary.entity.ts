import { ObjectType, Field } from "type-graphql";
import mongoose, { ObjectId } from "mongoose";
import {
  modelOptions,
  prop as Property,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";

@modelOptions({ schemaOptions: { _id: false }, options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class Translation {
  @Field((type) => ObjectIdScalar)
  @Property()
  tag!: ObjectId;

  @Field((type) => [String])
  @Property({ default: [] })
  value!: string[];
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class LabelTag {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  numberOfStates!: number;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class Language {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  code!: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class LanguageTranslation {
  @Field((type) => ObjectIdScalar)
  @Property()
  language!: ObjectId;

  @Field((type) => [Translation])
  @Property({ type: () => Translation, default: [] })
  translations!: Translation[];
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class LabelLibrary {
  @Field((type) => [LabelTag])
  @Property({ type: () => LabelTag, default: [] })
  labelTags!: LabelTag[];

  @Field((type) => [Language])
  @Property({ type: () => Language, default: [] })
  languages!: Language[];

  @Field((type) => [LanguageTranslation])
  @Property({ type: () => LanguageTranslation, default: [] })
  translations!: LanguageTranslation[];
}
