import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";
import { UserRole, UserStatus } from "./User.enum";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Ref } from "../utils/ref-type";
import { Organization } from "../Organizations/Organization.entity";
import { ObjectIdScalar } from "../utils/object-id.scalar";

@ObjectType()
export class User {
    @Field(type => ObjectIdScalar)
    readonly _id!: ObjectId;

    @Field()
    @Property({ required: true })
    email!: string;

    @Field()
    @Property({ required: true })
    password!: string;

    @Field()
    @Property({ required: true })
    userRole: UserRole = UserRole.USER;

    @Field(() => Date, { nullable: true })
    @Property({ required: false })
    lastLogin?: Date;

    @Field()
    @Property({ required: false })
    status?: string;

    @Field(type => [Organization])
    @Property({ ref: () => Organization, default: [] })
    organizations?: Ref<Organization>[];
}