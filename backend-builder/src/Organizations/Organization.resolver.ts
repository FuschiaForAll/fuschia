import { ApolloError } from "apollo-server";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { OrganizationModel, UserModel } from "../Models";
import { Context } from "../types";
import { Organization } from "./Organization.entity";
import { OrganizationInput } from "./Organization.input";

@Resolver(of => Organization)
export class OrganizationResolver {
  @Query(returns => [Organization])
  async listOrganizations(@Ctx() ctx: Context) {
    return OrganizationModel.find({
      $or: [{members: ctx.req.session.userId}, {owner: ctx.req.session.userId}]
    })
  }

  @Mutation(returns => Organization)
  async createOrganization(@Arg("organization") organization: OrganizationInput, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError("Unauthorized") }
    const org = new OrganizationModel({
      ...organization,
      owner: ctx.req.session.userId
    })
    org.save()
    const user = await UserModel.findById(ctx.req.session.userId)
    if (user) {
      user.organizations?.push(org.id)
      user.save()
    }
    return org 
  }
}