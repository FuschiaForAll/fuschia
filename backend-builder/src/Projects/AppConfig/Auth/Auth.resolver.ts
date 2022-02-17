import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ProjectModel } from "../../../Models";
import { Context } from "../../../types";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { ProjectService } from "../../Project.service";
import { Auth } from "./Auth.entity";
import { AuthInput } from "./Auth.input";

@Resolver()
export class AuthResolver {
  constructor(
    private projectService: ProjectService
  ) { }
  @Mutation(returns => Auth, { nullable: true })
  async updateAuth(@Arg('projectId', type => ObjectIdScalar) projectId: ObjectId, @Arg('input') input: AuthInput, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId || !this.projectService.checkAccess(projectId, ctx.req.session.userId)) { throw new ApolloError('Unauthorized')}
    const project = await ProjectModel.findById(projectId)
    if (project) {
      if (!project.appConfig.authConfig) {
        project.appConfig.authConfig = new Auth()
      }
      project.appConfig.authConfig = {
        ...project.appConfig.authConfig,
        ...input
      }
      return project.save()
    }
    return null
  }
}