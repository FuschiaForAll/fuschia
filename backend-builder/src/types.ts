import { User } from "./Users/User.entity";
import { Redis } from "ioredis";
import { Request as ExpressRequest, Response } from "express";
import { Session, SessionData } from "express-session";
import { UserRole } from "./Users/User.enum";
import { ObjectType, Field } from "type-graphql";
import { ObjectId } from "mongoose";

export interface Request extends ExpressRequest {
  session: Session & Partial<{
    email: string,
    userId: ObjectId,
    userRole: UserRole,
    data?: {
      token: string,
    }
  }>
}

export interface Context {
  req: Request,
  redis: Redis
  res: Response,
  user?: User,
}
@ObjectType()
export class FieldError {
@Field()
field!: string;

@Field()
message!: string;
}

@ObjectType()
export class MutationResponse {
@Field({defaultValue:"error"})
response!: "success" | "error";

@Field()
message!: string;

@Field({ nullable: true })
responseData?: number;

@Field(() => [FieldError], { nullable: true })
errors?: FieldError[];

@Field(() => String, { nullable: true })
sessionId?: String;
}