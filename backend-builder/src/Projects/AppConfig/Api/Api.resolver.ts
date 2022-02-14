import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../../types";
import { ApiService } from "./Api.service";

@Resolver()
export class ApiResolver {
  constructor(
    private apiService: ApiService
  ) { }
  @Mutation()
  async publishApi(@Ctx() ctx: Context) {

  }

  @Mutation(() => Boolean, { nullable: true })
  async createRelationship(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveRelationship(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listRelationships(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateRelationship(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteRelationship(@Ctx() ctx: Context) {
    return true
  }


  @Mutation(() => Boolean, { nullable: true })
  async createType(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveType(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listTypes(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateType(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteType(@Ctx() ctx: Context) {
    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  async createField(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveField(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listFields(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateField(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteField(@Ctx() ctx: Context) {
    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  async createQuery(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveQuery(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listQueries(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateQuery(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteQuery(@Ctx() ctx: Context) {
    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  async createMutation(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveMutation(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listMutations(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateMutation(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteMutations(@Ctx() ctx: Context) {
    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  async createSubscription(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveSubscription(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listSubscriptions(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateSubscription(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteSubscription(@Ctx() ctx: Context) {
    return true
  }
}