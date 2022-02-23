import { ApolloError } from "apollo-server";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { OrganizationModel, ProjectModel, UserModel } from "../Models";
import { OrganizationService } from "../Organizations/Organization.service";
import { Context } from "../types";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { AppConfig } from "./AppConfig/AppConfig.entity";
import { Project } from "./Project.entity";
import { ProjectInput, UpdateProjectInput } from "./Project.input";
import { ObjectId } from 'mongoose'
import { ProjectService } from "./Project.service";

@Service()
@Resolver(Project)
export class ProjectResolver {
  constructor(
    private organizationService: OrganizationService,
    private projectService: ProjectService
  ) {}

  @Query(returns => Project)
  async getProject(@Arg('projectId', type => ObjectIdScalar) projectId: ObjectId, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId || !this.projectService.checkAccess(projectId, ctx.req.session.userId)) { throw new ApolloError('Unauthorized')}
    const project = await ProjectModel.findById(projectId)
    return project
  }


  @Query(returns => [Project])
  async listProjects(@Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }
    const user = await UserModel.findById(ctx.req.session.userId)
    const projects = await ProjectModel.find({ organization: { $in: user?.organizations }})
    return projects
  }

  @Mutation(returns => Project)
  async createProject(@Arg("project") project: ProjectInput, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }

    const organization = await this.organizationService.getOrganization(project.organizationId, ctx.req.session.userId)

    const newProject = await new ProjectModel({
      projectName: project.projectName,
      organization,
      appConfig: new AppConfig(),
      body: '{"objects": []}',
    }).save()

    await OrganizationModel.findByIdAndUpdate(project.organizationId, { $push: { projects: newProject._id }})

    return newProject
  }

  @Mutation(returns => Project)
  async updateProject(@Arg("projectId", type => ObjectIdScalar) projectId: ObjectId, @Arg("project") project: UpdateProjectInput, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }

    const projectModel = await ProjectModel.findByIdAndUpdate(projectId, {
      projectName: project.projectName,
      body: project.body,
    })

    return { _id: projectId, ...project }
  }

  @Mutation(returns => ObjectIdScalar)
  async deleteProject(@Arg("projectId", type => ObjectIdScalar) projectId: ObjectId, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }
    await ProjectModel.findByIdAndDelete(projectId)
    return projectId
  }
}
