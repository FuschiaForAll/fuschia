import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ProjectModel } from "../../Models";
import { Context } from "../../types";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { ProjectService } from "../Project.service";
import { AppConfigInput } from "./AppConfig.input";

@Service()
@Resolver()
export class AppConfigResolver {
  constructor(private projectService: ProjectService) {}

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
}
