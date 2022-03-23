import { ObjectType, Field } from "type-graphql";
import mongoose, { ObjectId } from "mongoose";
import { modelOptions, prop as Property, Severity } from "@typegoose/typegoose";
import { Api } from "./Api/Api.entity";
import { Auth } from "./Auth/Auth.entity";
import { ObjectIdScalar } from "../../utils/object-id.scalar";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class AppConfig {
  @Property()
  liveJwtSecret?: string;

  @Property()
  sandboxJwtSecret?: string;

  @Field((type) => ObjectIdScalar, { nullable: true })
  @Property()
  appEntryComponentId?: ObjectId;

  @Field()
  @Property({ type: () => Api, default: new Api() })
  apiConfig!: Api;

  @Field()
  @Property({ type: () => Auth, default: new Auth() })
  authConfig!: Auth;
}
