import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from '../utils/object-id.scalar'
import { modelOptions, prop as Property, Severity } from "@typegoose/typegoose";
import { Component } from "../Component/Component.entity";
import { PackageScope } from "./PackageScope.enum";

@modelOptions({ options: { allowMixed: Severity.ALLOW }})
@ObjectType()
export class Package {
  @Field(type => ObjectIdScalar)
  readonly _id!: ObjectId;
  
  @Field()
  @Property({ required: true, unique: true})
  packageName!: String
  
  @Field()
  @Property({ required: true, unique: true })
  repositoryUrl!: String
  
  @Field()
  @Property({ required: true })
  version!: String

  @Field()
  @Property({ required: true })
  bundle!: String

  @Field(type => [Component])
  @Property({ type: () => Component, default: [] })
  components!: Component[]

  @Field(type => ObjectIdScalar)
  @Property({ required: true })
  authorId!: ObjectId

  @Field(type => PackageScope)
  @Property({ required: true, enum: PackageScope })
  scope!: PackageScope
}
