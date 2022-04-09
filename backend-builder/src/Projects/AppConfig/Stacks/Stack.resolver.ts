import { ApolloError } from "apollo-server";
import { Arg, Ctx, Mutation, Query, Resolver, Subscription } from "type-graphql";
import { Service } from "typedi";
import { StackModel } from "../../../Models";
import { Context } from "../../../types";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { Stack } from "./Stack.entity";
import { StackInput } from "./Stack.input";
import { ObjectId } from "mongoose";
import { ProjectService } from "../../Project.service";

@Service()
@Resolver(Stack)
export class StackResolver {
  constructor(
    private projectService: ProjectService
  ) {}

  @Query((returns) => Stack)
  async getStack(
    @Arg("stackId", (type) => ObjectIdScalar) stackId: ObjectId,
    @Ctx() ctx: Context
  ) {
    const stack = await StackModel.findById(stackId);
    if (stack) {
      if (
        !ctx.req.session.userId ||
        !this.projectService.checkAccess(stack.projectId, ctx.req.session.userId)
      ) {
        throw new ApolloError("Unauthorized");
      }
      return stack
    }
    throw new ApolloError("Unauthorized");
  }

  @Query((returns) => [Stack])
  async getStacks(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
      if (
        !ctx.req.session.userId ||
        !this.projectService.checkAccess(projectId, ctx.req.session.userId)
        ) {
          throw new ApolloError("Unauthorized");
        }
      const stacks = await StackModel.find({ projectId });
    return stacks
  }

  @Mutation((returns) => Stack)
  async createStack(
    @Arg("projectId", type => ObjectIdScalar) projectId: ObjectId,
    @Arg("stackInput") stackInput: StackInput,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
      ) {
        throw new ApolloError("Unauthorized");
      }

      return StackModel.create({
        ...stackInput,
        projectId,
      }, {})
  }

  @Mutation((returns) => Stack)
  async updateStack(
    @Arg("stackId", (type) => ObjectIdScalar) stackId: ObjectId,
    @Arg("stackInput") stackInput: StackInput,
    @Ctx() ctx: Context
  ) {
    const stack = await StackModel.findById(stackId);
    if (stack) {
      if (
        !ctx.req.session.userId ||
        !this.projectService.checkAccess(stack.projectId, ctx.req.session.userId)
      ) {
        throw new ApolloError("Unauthorized");
      }
      if (stackInput.name) {
        stack.name = stackInput.name
    }
      stack.save()
      return stack
    }
    throw new ApolloError("Unauthorized");
  }

  @Mutation((returns) => ObjectIdScalar)
  async deleteStack(
    @Arg("stackId", (type) => ObjectIdScalar) stackId: ObjectId,
    @Ctx() ctx: Context
  ) {
    const stack = await StackModel.findById(stackId);
    if (stack) {
      if (
        !ctx.req.session.userId ||
        !this.projectService.checkAccess(stack.projectId, ctx.req.session.userId)
      ) {
        throw new ApolloError("Unauthorized");
      }
      stack.delete()
      return stackId
    }
    throw new ApolloError("Unauthorized");
  }

  @Subscription(returns => Stack,{
    topics: "CREATE_STACK",
  })
  async onCreateStack() {

  }
  @Subscription(returns => ObjectIdScalar,{
    topics: "DELETE_STACK",
  })
  async onDeleteStack() {

  }
  @Subscription(returns => Stack,{
    topics: "UPDATE_STACK",
  })
  async onUpdateStack() {

  }
}
