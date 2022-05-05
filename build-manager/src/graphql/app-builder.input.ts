import { Field, InputType } from "type-graphql";
import { Component, Package, Project } from "../app-builder/types";
import { JsonInputFile } from "../server-builder/types";

@InputType()
export class AppBuilderInput {
  @Field()
  projectId!: string

  @Field(type => Object)
  project!: Project

  @Field(type => Object)
  components!: Component[]

  @Field(type => Object)
  packages!: Package[]

  @Field()
  githubToken!: string

  @Field()
  dockerhubUsername!: string

  @Field()
  dockerhubPassword!: string

  @Field()
  version!: string
}