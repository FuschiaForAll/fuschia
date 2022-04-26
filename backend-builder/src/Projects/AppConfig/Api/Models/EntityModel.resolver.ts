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
  constructor(private projectService: ProjectService) {}

  @Mutation(() => EntityModel, { nullable: true })
  async createEntityModel(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("name") name: string,
    @Arg("isLocal") isLocal: boolean,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    if (!name) {
      throw new ApolloError("Name required");
    }
    const project = await ProjectModel.findById(projectId);
    if (project) {
      const entityModel = new EntityModel();
      entityModel.name = name;
      entityModel.isLocal = isLocal
      project.appConfig.apiConfig.models.push(entityModel);
      project.save();
      return project.appConfig.apiConfig.models.at(-1);
    }
    return null;
  }

  @Query(() => EntityModel, { nullable: true })
  async getEntityModel(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("entityModelId", (type) => ObjectIdScalar) entityModelId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const project = await ProjectModel.findById(projectId);
    if (project) {
      console.log(`entityModelId`);
      console.log(entityModelId);
      console.log(
        JSON.stringify(
          project.appConfig.apiConfig.models.find(
            (m) => m._id.toString() === entityModelId.toString()
          )
        )
      );
      return project.appConfig.apiConfig.models.find(
        (m) => m._id.toString() === entityModelId.toString()
      );
    }
    return;
  }
  @Query(() => Boolean, { nullable: true })
  async listEntityModel(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateEntityModel(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => ObjectIdScalar, { nullable: true })
  async deleteEntityModel(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("entityModelId", (type) => ObjectIdScalar) entityModelId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const project = await ProjectModel.findById(projectId);
    if (project) {
      const apiConfig = project.appConfig.apiConfig;
      if (apiConfig) {
        apiConfig.models = apiConfig.models.filter((model) => {
          // @ts-ignore
          return !model._id.equals(entityModelId);
        });
        project.save();
        return entityModelId;
      }
    }
    return null;
  }
}
