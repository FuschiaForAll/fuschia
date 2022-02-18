import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";

enum AuthStrategy { 
  owner = "OWNER", 
  groups = "GROUPS", 
  private = "PRIVATE", 
  public = "PUBLIC" 
}
enum AuthProvider { 
  apiKey = "API_KEY", 
  userPools = "USER_POOLS" 
}
enum ModelOperation { 
  create = "CREATE", 
  update = "UPDATE", 
  delete = "DELETE", 
  read = "READ" 
}

@ObjectType()
export class DataAuth {
  @Field()
  @Property({ enum: AuthStrategy, type: String })
  allow!: AuthStrategy
  
  @Field()
  @Property({ enum: AuthProvider, type: String })
  provider!: AuthProvider

  @Field()
  ownerField!: String
  
  @Field()
  identityClaim!: String
  
  @Field()
  groupClaim!: String
  
  @Field(type => [String])
  groups!: String[]
  
  @Field()
  groupsField!: String
  
  @Field(type => [String])
  @Property({ enum: ModelOperation, type: [String] })
  operations!: ModelOperation[]
}