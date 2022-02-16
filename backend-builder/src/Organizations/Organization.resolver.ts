import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { OrganizationModel, UserModel } from "../Models";
import { Context } from "../types";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { Organization } from "./Organization.entity";
import { OrganizationInput } from "./Organization.input";

@Service()
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
    const org = await new OrganizationModel({
      ...organization,
      owner: ctx.req.session.userId
    }).save()
    await UserModel.findByIdAndUpdate(ctx.req.session.userId, { $push: { organizations: org._id }})
    return org 
  }

  @Mutation(returns => ObjectIdScalar)
  async deleteOrganization(@Arg("organizationId", type => ObjectIdScalar) organizationId: ObjectId, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId) { throw new ApolloError('Unauthorized') }
    await OrganizationModel.findOneAndDelete({ 
      $and: [
        { owner: ctx.req.session.userId },
        { _id: organizationId }
      ]
    })
    return organizationId
  }
}