import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field } from "type-graphql";
import { Auth } from "../Auth.entity";
import { DataField } from "../Fields/DataField.entity";
import { Key } from "../Key.entity";
import { ObjectIdScalar } from '../../../../utils/object-id.scalar'
@ObjectType()
export class EntityModel {
    @Field(type => ObjectIdScalar)
    readonly _id!: ObjectId;

    @Field()
    @Property({ required: true })
    name!: string;

    @Field(type => [Key])
    @Property({ type: () => Key, default: [] })
    keys!: Key[]

    @Field(type => [Auth])
    @Property({ type: () => Auth, default: [] })
    auth!: Auth[]

    @Field(type => [DataField])
    @Property({ type: () => DataField, default: [] })
    fields!: DataField[]
}