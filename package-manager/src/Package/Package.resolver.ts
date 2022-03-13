import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PackageModel } from "../Models";
import { Package } from "./Package.entity";
import { PackageInput } from "./Package.input";

@Service()
@Resolver((of) => Package)
export class PackageResolver {
  @Query(() => [Package])
  async getPackages() {
    return PackageModel.find();
  }

  @Mutation(() => Package)
  async createPackage(
    @Arg("packageInput", (type) => PackageInput) packageInput: PackageInput
  ) {
    console.log(packageInput);
    const createObj = await PackageModel.create({
      ...packageInput,
    });
    return {
      _id: createObj._id,
      ...packageInput,
    };
  }
}
