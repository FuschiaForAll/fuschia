import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PackageModel } from "../Models";
import { Component } from "./Component.entity";
import { ComponentInput } from "./Component.input";

@Service()
@Resolver((of) => Component)
export class ComponentResolver {
  @Query(() => [Component])
  async getComponents() {
    const packages = await PackageModel.find();
    if (packages) {
      return packages.flatMap((_package) => _package.components);
    }
    return [];
  }

  @Mutation(() => [Component])
  async publishComponents(
    @Arg("componentInput", (type) => [ComponentInput])
    componentInput: ComponentInput[]
  ) {
    console.log(componentInput);
    return PackageModel.insertMany(componentInput);
  }
}
