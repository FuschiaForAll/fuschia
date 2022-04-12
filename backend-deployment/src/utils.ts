function checkTypeForPrimitive(type: string) {
  switch (type) {
    case 'ID':
    case 'String':
    case 'Boolean':
    case 'Int':
      return true
  }
  return false
}

export interface Key {
  fieldName: string
  dataType: string
  nullable: boolean
}

export function generateConnections(typename: string) {
  const builder = []
  builder.push(`@ObjectType()`)
  builder.push(`export class Model${typename}Connection {`)
  builder.push(`  @Field(type => [${typename}])`)
  builder.push(`  items!: ${typename}[]`)
  builder.push(`  @Field()`)
  builder.push(`  nextToken!: string`)
  builder.push(`}`)
  return builder.join('\n')
}

export function generateCreateInput({
  typename,
  keys,
}: {
  typename: string
  keys: Key[]
}) {
  const builder = []
  builder.push(`@InputType()`)
  builder.push(`export class Create${typename}Input {`)
  keys.forEach(key => {
    const isPrimitive = checkTypeForPrimitive(key.dataType)
    if (isPrimitive) {
      builder.push(`  @Field({ nullable: ${key.nullable} })`)
      builder.push(
        `  ${key.fieldName}${key.nullable ? '?' : '!'}: ${key.dataType}`
      )
    }
  })
  builder.push(`}`)
  return builder.join('\n')
}

export function generateUpdateInput({
  typename,
  keys,
}: {
  typename: string
  keys: Key[]
}) {
  const builder = []
  builder.push(`@InputType()`)
  builder.push(`export class Update${typename}Input {`)
  keys.forEach(key => {
    builder.push(`  @Field({ nullable: true })`)
    builder.push(`  ${key.fieldName}?: ${key.dataType}`)
  })
  builder.push(`}`)
  return builder.join('\n')
}

export function generateDeleteInput({ typename }: { typename: string }) {
  const builder = []
  builder.push(`@InputType()`)
  builder.push(`export class Delete${typename}Input {`)
  builder.push(`  @Field(type => ObjectIdScalar)`)
  builder.push(`  _id!: ObjectId`)
  builder.push(`}`)
  return builder.join('\n')
}

export function generateConditionalInput({
  typename,
  keys,
}: {
  typename: string
  keys: Key[]
}) {
  const builder = []
  builder.push(`@InputType()`)
  builder.push(`export class Model${typename}ConditionalInput {`)
  builder.push(`  @Field(type => ObjectIdScalar)`)
  builder.push(`  _id!: ObjectId`)
  keys.forEach(key => {
    builder.push(
      `  @Field(type => Model${key.dataType}Input, { nullable: true })`
    )
    builder.push(`  ${key.fieldName}?: Model${key.dataType}Input`)
  })
  builder.push(
    `  @Field(type => [Model${typename}ConditionalInput], { nullable: true })`
  )
  builder.push(`  and?: Model${typename}ConditionalInput[]`)
  builder.push(
    `  @Field(type => [Model${typename}ConditionalInput], { nullable: true })`
  )
  builder.push(`  or?: Model${typename}ConditionalInput[]`)
  builder.push(
    `  @Field(type => [Model${typename}ConditionalInput], { nullable: true })`
  )
  builder.push(`  not?: Model${typename}ConditionalInput`)
  builder.push(`}`)
  return builder.join('\n')
}
export function generateFilterInput({
  typename,
  keys,
}: {
  typename: string
  keys: Key[]
}) {
  const builder = []
  builder.push(`@InputType()`)
  builder.push(`export class Model${typename}FilterInput {`)
  builder.push(`  @Field(type => ObjectIdScalar)`)
  builder.push(`  _id!: ObjectId`)
  keys.forEach(key => {
    builder.push(
      `  @Field(type => Model${key.dataType}Input, { nullable: true })`
    )
    builder.push(`  ${key.fieldName}?: Model${key.dataType}Input`)
  })
  builder.push(
    `  @Field(type => [Model${typename}FilterInput], { nullable: true })`
  )
  builder.push(`  and?: Model${typename}FilterInput[]`)

  builder.push(
    `  @Field(type => [Model${typename}FilterInput], { nullable: true })`
  )
  builder.push(`  or?: Model${typename}FilterInput[]`)

  builder.push(
    `  @Field(type => Model${typename}FilterInput, { nullable: true })`
  )
  builder.push(`  not?: Model${typename}FilterInput`)
  builder.push(`}`)
  return builder.join('\n')
}
