import { registerEnumType } from "type-graphql";

export enum PackageComponentType {
  Element = "Element",
  Screen = "Screen",
  Stack = "Stack",
  Container = "Container",
}

registerEnumType(PackageComponentType, {
  name: "PackageComponentType",
  description:
    "The type of component, dictates where it can be dropped or if things can be dropped on it",
});
