import { getModelForClass } from "@typegoose/typegoose";
import { Package } from "./Package/Package.entity";

export const PackageModel = getModelForClass(Package)