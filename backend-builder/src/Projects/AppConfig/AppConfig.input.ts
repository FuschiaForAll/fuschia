import { ObjectId } from "mongoose";
import { Field, InputType } from "type-graphql";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { AppConfig } from "./AppConfig.entity";

@InputType()
export class AppConfigInput implements Partial<AppConfig> {
  @Field((type) => ObjectIdScalar, { nullable: true })
  appEntryComponentId?: ObjectId;
}
