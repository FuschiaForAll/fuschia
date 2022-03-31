import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PackageModel } from "../../Models";
import { PackageComponent } from "./PackageComponent.entity";
import { PackageComponentInput } from "./PackageComponent.input";

@Service()
@Resolver((of) => PackageComponent)
export class PackageComponentResolver {
  @Query(() => [PackageComponent])
  async getPackageComponents() {
    const packages = await PackageModel.find();
    if (packages) {
      return packages.flatMap((_package) => _package.components);
    }
    return [];
  }

  @Mutation(() => [PackageComponent])
  async publishPackageComponents(
    @Arg("componentInput", (type) => [PackageComponentInput])
    componentInput: PackageComponentInput[]
  ) {
    console.log(componentInput);
    return PackageModel.insertMany(componentInput);
  }
}
