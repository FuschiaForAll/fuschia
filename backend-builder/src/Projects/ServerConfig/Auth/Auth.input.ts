import { InputType, Field } from "type-graphql";
import { Auth } from "./Auth.entity";

@InputType()
export class AuthInput implements Partial<Auth> {
  @Field({ nullable: true })
  requiresAuth!: Boolean;

  @Field({ nullable: true })
  allowUnauthenticatedUsers!: Boolean;
  
  @Field({ nullable: true })
  mfaEnabled!: Boolean;
  
  @Field({ nullable: true })
  mfaConfiguration!: 'OFF' | 'ON' | 'OPTIONAL';
  
  @Field({ nullable: true })
  mfaTypes!: 'SMS' | 'TOTP' | 'EMAIL';
  
  @Field({ nullable: true })
  smsAuthenticationMessage!: string;
  
  @Field({ nullable: true })
  smsVerificationMessage!: string;
  
  @Field({ nullable: true })
  emailVerificationSubject!: string;
  
  @Field({ nullable: true })
  emailVerificationMessage!: string;

  @Field({ nullable: true })
  defaultPasswordPolicy!: boolean;

  @Field({ nullable: true })
  passwordPolicyMinLength!: number;
  
  @Field({ nullable: true })
  passwordRequiresUppercase!: boolean;

  @Field({ nullable: true })
  passwordRequiresNumbers!: boolean;
  
  @Field({ nullable: true })
  passwordRequiresSymbols!: boolean;
  
  @Field(type => [String], { nullable: true })
  requiredAttributes!: string[];
  
  @Field({ nullable: true })
  clientRefreshTokenValidity!: number;
  
  @Field({ nullable: true })
  usernameCaseSensitive!: boolean;
  
  @Field({ nullable: true })
  tableId!: string;

  @Field({ nullable: true })
  usernameFieldId!: string;

  @Field({ nullable: true })
  passwordFieldId!: string;
}