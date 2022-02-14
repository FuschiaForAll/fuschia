import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ProjectModel } from "../../../../Models";
import { Context } from "../../../../types";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { ProjectService } from "../../../Project.service";
import { EntityModel } from "./EntityModel.entity";

@Service()
@Resolver()
export class EntityModelResolver {
  constructor(
    private projectService: ProjectService
  ) { }

  @Mutation(() => EntityModel, { nullable: true })
  async createEntityModel(@Arg('projectId', type => ObjectIdScalar) projectId: ObjectId, @Arg('name') name: string, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId || !this.projectService.checkAccess(projectId, ctx.req.session.userId)) { throw new ApolloError('Unauthorized')}
    const project = await ProjectModel.findById(projectId)
    if (project) {
      const entityModel = new EntityModel
      entityModel.name = name
      project.appConfig.apiConfig.models.push(entityModel)
      project.save()
      return project.appConfig.apiConfig.models.at(-1)
    }
    return null
  }

  @Query(() => Boolean, { nullable: true })
  async retrieveEntityModel(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listEntityModel(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateEntityModel(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteEntityModel(@Ctx() ctx: Context) {
    return true
  }
}