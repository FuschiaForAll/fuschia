import { registerEnumType } from "type-graphql";

export enum PackageScope {
  Global = "Global",
  Private = "Private",
  Public = "Public"
}

registerEnumType(PackageScope, {
  name: "PackageScope",
  description: "The scope of the package. Globals are default available to everyone, Public are usable by everyone, Private is usable by permissions",
});