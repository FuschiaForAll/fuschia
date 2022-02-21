import { ObjectId } from "mongoose";
import { Field, InputType } from "type-graphql";
import { Organization } from "../Organizations/Organization.entity";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { Ref } from "../utils/ref-type";
import { Project } from "./Project.entity";

@InputType()
export class ProjectInput {
  @Field()
  projectName!: string;

  @Field(type => ObjectIdScalar)
  organizationId!: ObjectId;

  @Field(type => String)
  body!: string;
}
