import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";
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
    @Field()
    fieldName!: string;
    
    @Field()
    isUnique!: boolean;
    
    @Field()
    isHashed!: boolean;

    @Field()
    dataType!: string;

    @Field(type => [Auth])
    @Property({ type: () => [Auth] })
    rules!: Auth[]

    @Field(type => [Key])
    @Property({ type: () => [Key] })
    keys!: Key[]

    @Field(type => [Connection])
    @Property({ type: () => [Connection] })
    connections!: Connection[]
}