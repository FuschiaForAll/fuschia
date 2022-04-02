import { ApolloError } from "apollo-server";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import {
  OrganizationModel,
  PreviewerModel,
  ProjectModel,
  UserModel,
} from "../Models";
import { OrganizationService } from "../Organizations/Organization.service";
import { Context } from "../types";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { ObjectId } from "mongoose";
import { ProjectService } from "../Projects/Project.service";
import { Previewer } from "./Previewer.entity";

@Service()
@Resolver(Previewer)
export class PreviewerResolver {
  constructor(
    private organizationService: OrganizationService,
    private projectService: ProjectService
  ) {}

  @Query((returns) => Previewer)
  async getPreviewerData(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const previewerData = await PreviewerModel.find({ project: projectId });
    console.log(`get previewviewer data`);
    console.log(previewerData);
    if (previewerData.length > 0) {
      return previewerData[0];
    }
    console.log(`create previewer data`);
    console.log(previewerData);
    return PreviewerModel.create({
      project: projectId,
    });
  }

  @Mutation((returns) => Previewer)
  async updatePreviewerData(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("data", (type) => Object, { nullable: true }) data: Object,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const previewer = await PreviewerModel.findOneAndUpdate(
      { project: projectId },
      {
        data,
      },
      { returnDocument: "after" }
    );
    console.log(previewer);
    return previewer;
  }
}
