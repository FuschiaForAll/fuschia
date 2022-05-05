import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { AppBuilderService } from "../app-builder";
import { AppBuilderInput } from "./app-builder.input";

@Service()
@Resolver()
export class AppBuilderResolver {
  constructor(
    private appBuilderService: AppBuilderService
  ){}

  @Mutation(returns => Boolean)
  async kickoffNewAppBuild(@Arg('input', type => AppBuilderInput) input: AppBuilderInput) {
    this.appBuilderService.KickoffNewBuild(input)
  }
}