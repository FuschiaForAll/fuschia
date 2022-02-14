import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { Ref } from "../../../../utils/ref-type";
import { Auth } from "../Auth.entity";
import { Key } from "../Key.entity";
import { DataTypes } from "./DataField.enum";

@ObjectType()
export class Connection {

    @Field()
    @Property({ required: true })
    keyName!: string

    @Field(type => [String])
    fieldNames!: string[]
}

@ObjectType()
export class DataField {

    @Field(type => ObjectIdScalar)
    readonly _id!: ObjectId;
    
    @Field()
    @Property({ unique: true })
    fieldName!: string;
    
    @Field()
    @Property()
    isUnique!: boolean;
    
    @Field()
    @Property()
    isHashed!: boolean;
    
    @Field()
    @Property()
    nullable!: boolean;

    @Field()
    @Property()
    dataType!: string;

    @Field(type => [Auth])
    @Property({ type: () => [Auth], default: [] })
    rules!: Auth[]

    @Field(type => [Key])
    @Property({ type: () => [Key], default: [] })
    keys!: Key[]

    @Field(type => [Connection], { nullable: true })
    @Property({ type: () => Connection })
    connection!: Connection
}