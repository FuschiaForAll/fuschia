import { ObjectType, Field } from "type-graphql";
import { prop as Property } from "@typegoose/typegoose";
import { Ref } from "../utils/ref-type";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { Project } from "../Projects/Project.entity";

@ObjectType()
export class Previewer {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field((type) => Project)
  @Property({ ref: () => Project })
  project!: Ref<Project>;

  @Field((type) => Object, { nullable: true })
  @Property()
  data?: Object;
}
