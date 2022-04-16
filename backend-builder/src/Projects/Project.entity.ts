import { ObjectType, Field } from "type-graphql";
import { prop as Property } from "@typegoose/typegoose";
import { Organization } from "../Organizations/Organization.entity";
import { Ref } from "../utils/ref-type";
import { AppConfig } from "./AppConfig/AppConfig.entity";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { v4 as uuid } from "uuid";
import { Component } from "./AppConfig/Components/Component.entity";
import { LabelLibrary } from "./AppConfig/Libraries/LabelLibrary/LabelLibrary.entity";
import { AssetLibrary } from "./AppConfig/Libraries/ImageLibrary/AssetLibrary.entity";

@ObjectType()
export class Project {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field((type) => String)
  @Property({ required: true, default: uuid() })
  readonly appId!: string;

  @Field()
  @Property({ required: true })
  projectName!: string;

  @Field((type) => Organization)
  @Property({ ref: "Organization", required: true })
  organization!: Ref<Organization>;

  @Field((type) => AppConfig)
  @Property({ type: () => AppConfig, required: true })
  appConfig!: AppConfig;

  @Field((type) => LabelLibrary)
  @Property({ type: () => LabelLibrary })
  labelLibrary?: LabelLibrary;

  @Field((type) => AssetLibrary, { nullable: true })
  @Property({ type: () => AssetLibrary })
  assetLibrary?: AssetLibrary;
}
