import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { AppBuilderService } from "../../CodeGen/app-builder";
import { ComponentModel, PackageModel, ProjectModel } from "../../Models";
import { Context } from "../../types";
import { DOCKERHUB_PASSWORD, DOCKERHUB_USERNAME, GITHUB_API_KEY } from "../../utils/config";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { ProjectService } from "../Project.service";
import { AppVariable } from "./AppConfig.entity";
import { AppConfigInput } from "./AppConfig.input";

@Service()
@Resolver()
export class AppConfigResolver {
  constructor(
    private projectService: ProjectService,
    private appBuilderService: AppBuilderService) {}

  @Mutation((returns) => Boolean)
  async updateAppConfig(
    @Arg("appConfig", (type) => AppConfigInput)
    appConfig: AppConfigInput,
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const update = Object.keys(appConfig).reduce((acc, key) => {
      // @ts-ignore
      acc[`appConfig.${key}`] = appConfig[key];
      return acc;
    }, {} as any);

    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $set: update,
      },
      { returnDocument: "after" }
    );
    console.log(`after project`);
    console.log(project);
    return true;
  }

  @Mutation(() => AppVariable)
  async createAppVariable(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("name") name: string,
    @Arg("type") type: string,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const newProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $push: {
          "serverConfig.apiConfig.variables": {
            name,
            type,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );
    return newProject?.appConfig.variables[
      newProject?.appConfig.variables.length - 1
    ];
  }

  @Mutation(() => Boolean)
  async deleteAppVariable(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("variableId", (type) => ObjectIdScalar) variableId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const newProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          "appConfig.variables": { _id: variableId },
        },
      },
      {
        returnDocument: "after",
      }
    );
    return true;
  }

  @Mutation(() => Boolean)
  async publishApp(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("sandbox") sandbox: boolean,
    @Arg("version") version: string,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const project = await ProjectModel.findById(projectId);
    const components = await ComponentModel.find({
      projectId
    });
    const packages = await PackageModel.find()
    if (project) {
      this.appBuilderService.KickoffNewBuild(
        project.toJSON() as any,
        components.map(c => c.toJSON()) as any,
        packages.map(p => p.toJSON()) as any,
        version,
        GITHUB_API_KEY,
        DOCKERHUB_USERNAME,
        DOCKERHUB_PASSWORD
      )
    }
    return true;
  }
}
