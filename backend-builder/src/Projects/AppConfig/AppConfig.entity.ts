import { ObjectType, Field } from "type-graphql";
import { Api } from "./Api/Api.entity";

@ObjectType()
export class AppConfig {
    @Field()
    apiConfig!: Api;
}