import { ObjectType, Field } from "type-graphql";
import { prop as Property, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { ObjectId } from "mongoose";

@modelOptions({ options: { allowMixed: Severity.ALLOW }})
@ObjectType()
export class Auth {
  @Field(type => ObjectIdScalar)
  readonly _id!: ObjectId
  
  @Field()
  @Property({ default: false })
  requiresAuth!: Boolean;

  @Field()
  @Property({ default: false })
  allowUnauthenticatedUsers!: Boolean;
  
  @Field()
  @Property({ default: false })
  mfaEnabled!: Boolean;
  
  @Field()
  @Property({ default: 'OFF' })
  mfaConfiguration!: 'OFF' | 'ON' | 'OPTIONAL';
  
  @Field()
  @Property({ default: 'SMS' })
  mfaTypes!: 'SMS' | 'TOTP' | 'EMAIL';
  
  @Field()
  @Property({ default: 'Your authentication code is {####}' })
  smsAuthenticationMessage!: string;
  
  @Field()
  @Property({ default: 'Your verification code is {####}' })
  smsVerificationMessage!: string;
  
  @Field()
  @Property({ default: 'Your verification code' })
  emailVerificationSubject!: string;
  
  @Field()
  @Property({ default: 'Your verification code is {####}' })
  emailVerificationMessage!: string;

  @Field()
  @Property({ default: false })
  defaultPasswordPolicy!: boolean;

  @Field()
  @Property({ default: 8 })
  passwordPolicyMinLength!: number;
  
  @Field()
  @Property({ default: false })
  passwordRequiresUppercase!: boolean;

  @Field()
  @Property({ default: false })
  passwordRequiresNumbers!: boolean;
  
  @Field()
  @Property({ default: false })
  passwordRequiresSymbols!: boolean;

  @Field(type => [String], )
  @Property({type: () => [String], default: [] })
  requiredAttributes!: string[];
  
  @Field()
  @Property({ default: 10 })
  clientRefreshTokenValidity!: number;
  
  @Field()
  @Property({ default: false })
  usernameCaseSensitive!: boolean;
  
  @Field()
  @Property({ default: '' })
  tableId!: string;

  @Field()
  @Property({ default: '' })
  usernameFieldId!: string;

  @Field()
  @Property({ default: '' })
  passwordFieldId!: string;
}