import { ObjectType, Field } from "type-graphql";
import { prop as Property } from "@typegoose/typegoose";
import { Organization } from "../Organizations/Organization.entity";
import { Ref } from "../utils/ref-type";
import { AppConfig } from "./AppConfig/AppConfig.entity";
import { ObjectId } from "mongoose";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { AppBody } from "@fuchsia/types";
import { v4 as uuid } from 'uuid';

@ObjectType()
export class Project {
    @Field(type => ObjectIdScalar)
    readonly _id!: ObjectId;

    @Field(type => String)
    @Property({ required: true, default: uuid() })
    readonly appId!: string;

    @Field()
    @Property({ required: true })
    projectName!: string;

    @Field(type => Organization)
    @Property({ ref: 'Organization', required: true })
    organization!: Ref<Organization>;

    @Field(type => AppConfig)
    @Property({ type: () => AppConfig, required: true })
    appConfig!: AppConfig;

    @Field(type => AppBody)
    @Property({ type: () => AppBody, required: false })
    body!: AppBody
}
