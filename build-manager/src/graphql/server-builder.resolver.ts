import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ServerBuilderService } from "../server-builder";
import { ServerBuilderInput } from "./server-builder.input";

@Service()
@Resolver()
export class ServerBuilderResolver {
  constructor(
    private serverBuilderService: ServerBuilderService
  ){}

  @Query(returns => Boolean)
  async DummyQuery() {
    
  }

  @Mutation(returns => Boolean)
  async kickoffNewServerBuild(@Arg('input', type => ServerBuilderInput) input: ServerBuilderInput) {
    this.serverBuilderService.KickoffNewBuild(input)
  }
}