import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ProjectModel } from "../../Models";
import { Context } from "../../types";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { ProjectService } from "../Project.service";

@Resolver()
export class AppConfigResolver {
  constructor(private projectService: ProjectService) {}

  @Mutation((returns) => Boolean)
  async updateAppEntryPoint(
    @Arg("appEntryComponentId", (type) => ObjectIdScalar)
    appEntryComponentId: ObjectId,
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        appEntryComponentId,
      },
      { new: true, useFindAndModify: false }
    );
    return true;
  }
}
