import { ObjectType, Field } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Organization } from "../Organizations/Organization.entity";
import { Ref } from "../utils/ref-type";
import { AppConfig } from "./AppConfig/AppConfig.entity";

@ObjectType()
export class Project {
    @Field()
    id!: number;

    @Field()
    projectName!: string;

    @Field(type => Organization)
    @Property({ ref: 'Organization', required: true })
    organization!: Ref<Organization>;

    @Field(type => AppConfig)
    @Property({ type: () => AppConfig, required: true })
    appConfig!: AppConfig;
}
