import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ProjectModel } from "../Models";
import { Context } from "../types";
import { Project } from "./Project.entity";
import { ProjectInput } from "./Project.input";

@Resolver(Project)
export class ProjectResolver {
  @Mutation(returns => Project)
  async createProject(@Arg("project") project: ProjectInput) {
    const newProject = new ProjectModel({
      ...project
    })
    newProject.save()
    return newProject
  }
}