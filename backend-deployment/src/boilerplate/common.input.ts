import { ObjectId } from 'mongodb'
import { Field, InputType, Int, registerEnumType } from 'type-graphql'
import { ObjectIdScalar } from './utils/object-id.scalar'

@InputType()
export class ModelSizeInput {
  @Field(type => Int, { nullable: true })
  ne?: number
  @Field(type => Int, { nullable: true })
  eq?: number
  @Field(type => Int, { nullable: true })
  le?: number
  @Field(type => Int, { nullable: true })
  lt?: number
  @Field(type => Int, { nullable: true })
  ge?: number
  @Field(type => Int, { nullable: true })
  gt?: number
  @Field(type => [Int], { nullable: true })
  between?: number[]
}

export enum ModelAttributeTypes {
  binary,
  binarySet,
  bool,
  list,
  map,
  number,
  numberSet,
  string,
  stringSet,
  _null,
}

registerEnumType(ModelAttributeTypes, {
  name: 'ModelAttributeTypes',
})

@InputType()
export class ModelStringInput {
  @Field({ nullable: true })
  ne?: String
  @Field({ nullable: true })
  eq?: String
  @Field({ nullable: true })
  le?: String
  @Field({ nullable: true })
  lt?: String
  @Field({ nullable: true })
  ge?: String
  @Field({ nullable: true })
  gt?: String
  @Field({ nullable: true })
  contains?: String
  @Field({ nullable: true })
  notContains?: String
  @Field({ nullable: true })
  between?: [String]
  @Field({ nullable: true })
  beginsWith?: String
  @Field({ nullable: true })
  attributeExists?: Boolean
  @Field(type => ModelAttributeTypes, { nullable: true })
  attributeType?: ModelAttributeTypes
  @Field(type => ModelSizeInput, { nullable: true })
  size?: ModelSizeInput
}

@InputType()
export class ModelBooleanInput {
  @Field({ nullable: true })
  ne?: Boolean
  @Field({ nullable: true })
  eq?: Boolean
  @Field({ nullable: true })
  attributeExists?: Boolean
  @Field(type => ModelAttributeTypes, { nullable: true })
  attributeType?: ModelAttributeTypes
}

export enum ModelSortDirection {
  ASC,
  DESC,
}

registerEnumType(ModelSortDirection, {
  name: 'ModelSortDirection',
})

@InputType()
export class ModelObjectIdInput {
  @Field(type => ObjectIdScalar, { nullable: true })
  ne?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  eq?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  le?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  lt?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  ge?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  gt?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  contains?: ObjectId
  @Field(type => ObjectIdScalar, { nullable: true })
  notContains?: ObjectId
  @Field(type => [ObjectIdScalar], { nullable: true })
  between?: ObjectId[]
  @Field(type => ObjectIdScalar, { nullable: true })
  beginsWith?: ObjectId
  @Field({ nullable: true })
  attributeExists?: Boolean
  @Field(type => ModelAttributeTypes, { nullable: true })
  attributeType?: ModelAttributeTypes
  @Field(type => ModelSizeInput, { nullable: true })
  size?: ModelSizeInput
}
