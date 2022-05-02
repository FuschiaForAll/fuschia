import { ObjectType, Field } from "type-graphql";
import mongoose, { ObjectId } from "mongoose";
import { modelOptions, prop as Property, Severity } from "@typegoose/typegoose";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { Api } from "./Api/Api.entity";
import { Auth } from "./Auth/Auth.entity";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class ServerConfig {
  @Property()
  liveJwtSecret?: string;

  @Property()
  sandboxJwtSecret?: string;

  @Property()
  githubUrl?: string;

  @Field()
  @Property({ type: () => Api, default: new Api() })
  apiConfig!: Api;

  @Field()
  @Property({ type: () => Auth, default: new Auth() })
  authConfig!: Auth;
}
