import { Field, InputType } from "type-graphql";
import { JsonInputFile } from "../server-builder/types";

@InputType()
export class ServerBuilderInput {
  @Field()
  projectId!: string

  @Field(type => Object)
  project!: JsonInputFile

  @Field()
  githubToken!: string

  @Field()
  dockerhubUsername!: string

  @Field()
  dockerhubPassword!: string

  @Field()
  mongoDbConnectionString!: string

  @Field()
  version!: string
}