import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ProjectModel } from "../../../Models";
import { Context } from "../../../types";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { ProjectService } from "../../Project.service";
import { Auth } from "./Auth.entity";
import { AuthInput } from "./Auth.input";

@Service()
@Resolver()
export class AuthResolver {
  constructor(private projectService: ProjectService) {}
  @Query((returns) => Auth, { nullable: true })
  async getAuth(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
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
      return project.serverConfig.authConfig;
    }
    return null;
  }
  @Mutation((returns) => Auth, { nullable: true })
  async updateAuth(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("input") input: AuthInput,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const update = Object.keys(input).reduce((acc, key) => {
      // @ts-ignore
      acc[`serverConfig.authConfig.${key}`] = input[key];
      return acc;
    }, {} as any);
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $set: update,
      },
      { returnDocument: "after" }
    );
    if (project && project.serverConfig) {
      return project.serverConfig.authConfig;
    }
    return null;
  }
}
