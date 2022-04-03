import { ObjectId } from "mongoose";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PackageModel } from "../../Models";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
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
  @Query(() => PackageComponent, { nullable: true })
  async getPackageComponent(
    @Arg("packageComponentId", (type) => ObjectIdScalar)
    packageComponentId: ObjectId
  ) {
    const packages = await PackageModel.find();
    if (packages) {
      packages.forEach((componentPackage) =>
        componentPackage.components.forEach((component) => {
          if (component._id.toString() === packageComponentId.toString()) {
            return component;
          }
        })
      );
    }
    return null;
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
