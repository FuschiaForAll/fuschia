import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Ref } from "../utils/ref-type";
import { User } from "../Users/User.entity";
import { Project } from "../Projects/Project.entity";
import { ObjectIdScalar } from "../utils/object-id.scalar";

@ObjectType()
export class Invitation {
  @Field((type) => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property()
  public userEmail!: string;

  @Field((type) => ObjectIdScalar)
  @Property()
  public organizationId!: ObjectId;

  @Property()
  public token!: string;

  @Property()
  public expires!: number;

  @Field({ nullable: true })
  @Property()
  public acceptedDate!: Date;
}
