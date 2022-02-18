import { ObjectType, Field } from "type-graphql";
import mongoose from 'mongoose'
import { modelOptions, prop as Property, Severity } from "@typegoose/typegoose";
import { Api } from "./Api/Api.entity";
import { Auth } from "./Auth/Auth.entity";

@modelOptions({ options: { allowMixed: Severity.ALLOW }})
@ObjectType()
export class AppConfig {
    @Field()
    @Property({type: () => Api, default: new Api() })
    apiConfig!: Api;

    @Field()
    @Property({type: () => Auth, default: new Auth() })
    authConfig!: Auth;
}