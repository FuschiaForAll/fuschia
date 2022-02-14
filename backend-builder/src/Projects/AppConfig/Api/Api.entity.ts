import { ObjectType, Field } from "type-graphql";
import { EntityModel } from "./Models/EntityModel.entity";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

@ObjectType()
export class Api {
    @Field(type => [EntityModel])
    @Property({ type: () => EntityModel, default: [] })
    models!: EntityModel[];

    @Field(type => [String])
    queries!: string[]

    @Field(type => [String])
    mutation!: string[]

    @Field(type => [String])
    subscriptions!: string[]
}