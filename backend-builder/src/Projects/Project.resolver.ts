import { ApolloError } from "apollo-server";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { OrganizationModel, ProjectModel, UserModel } from "../Models";
import { OrganizationService } from "../Organizations/Organization.service";
import { Context } from "../types";
import { AppConfig } from "./AppConfig/AppConfig.entity";
import { Project } from "./Project.entity";
import { ProjectInput } from "./Project.input";

@Service()
@Resolver(Project)
export class ProjectResolver {
  constructor(
    private organizationService: OrganizationService
  ) {}

  @Query(returns => [Project])
  async listProjects(@Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }
    const user = await UserModel.findOne({ where: { _id: ctx.req.session.userId }})
    const projects = await ProjectModel.find().where({ $in: { organization: user?.organizations }})
    console.log(projects)
    return projects
  }

  @Mutation(returns => Project)
  async createProject(@Arg("project") project: ProjectInput, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }
    const organization = await this.organizationService.getOrganization(project.organizationId, ctx.req.session.userId)
    const newProject = await new ProjectModel({
      projectName: project.projectName,
      organization,
      appConfig: new AppConfig()
    }).save()
    await OrganizationModel.findByIdAndUpdate(project.organizationId, { $push: { projects: newProject._id }})
    return newProject
  }
}