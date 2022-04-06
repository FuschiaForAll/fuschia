import { Project } from './types'

const {
  ModelIDInput,
  ModelSizeInput,
  ModelAttributeTypes,
  ModelStringInput,
  ModelBooleanInput,
  ModelSortDirection,
} = require('./api.consts')

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

function generateConnections(typename: string) {
  const builder = []
  builder.push(`type Model${typename}Connection {`)
  builder.push(`  items: [${typename}]`)
  builder.push(`  nextToken: String`)
  builder.push(`}`)
  return builder.join('\n')
}

interface GenerateParameters {
  typename: string
  keys: Array<{
    fieldName: string
    nullable?: boolean
    dataType: string
  }>
  nullable?: boolean
}

function generateCreateInput({ typename, keys, nullable }: GenerateParameters) {
  const builder = []
  builder.push(`input Create${typename}Input {`)
  keys.forEach(key => {
    const isPrimitive = checkTypeForPrimitive(key.dataType)
    if (isPrimitive) {
      builder.push(
        `  ${key.fieldName.replaceAll(' ', '')}: ${key.dataType}${
          key.nullable ? '' : '!'
        }`
      )
    } else {
      builder.push(
        `  ${key.fieldName.replaceAll(' ', '')}: ID${key.nullable ? '' : '!'}`
      )
    }
  })
  builder.push(`}`)
  return builder.join('\n')
}

function generateUpdateInput({ typename, keys }: GenerateParameters) {
  const builder = []
  builder.push(`input Update${typename}Input {`)
  builder.push(`  _id: ID!`)
  keys.forEach(key =>
    builder.push(`  ${key.fieldName.replaceAll(' ', '')}: ${key.dataType}`)
  )
  builder.push(`}`)
  return builder.join('\n')
}

function generateDeleteInput({ typename, keys }: GenerateParameters) {
  const builder = []
  builder.push(`input Delete${typename}Input {`)
  builder.push(`  _id: ID!`)
  builder.push(`}`)
  return builder.join('\n')
}

function generateConditionalInput({ typename, keys }: GenerateParameters) {
  const builder = []
  builder.push(`input Model${typename}ConditionalInput {`)
  keys.forEach(key =>
    builder.push(
      `  ${key.fieldName.replaceAll(' ', '')}: Model${key.dataType}Input`
    )
  )
  builder.push(`  and: [Model${typename}ConditionalInput]`)
  builder.push(`  or: [Model${typename}ConditionalInput]`)
  builder.push(`  not: Model${typename}ConditionalInput`)
  builder.push(`}`)
  return builder.join('\n')
}
function generateFilterInput({ typename, keys }: GenerateParameters) {
  const builder = []
  builder.push(`input Model${typename}FilterInput {`)
  builder.push(`  _id: ModelIDInput`)
  keys.forEach(key =>
    builder.push(
      `  ${key.fieldName.replaceAll(' ', '')}: Model${key.dataType}Input`
    )
  )
  builder.push(`  and: [Model${typename}FilterInput]`)
  builder.push(`  or: [Model${typename}FilterInput]`)
  builder.push(`  not: Model${typename}FilterInput`)
  builder.push(`}`)
  return builder.join('\n')
}

const tableAndFieldNameMap = {} as {
  [key: string]: {
    id: string
    fields: {
      [key: string]: {
        id: string
        config: { isUnique: boolean; isHashed: boolean }
      }
    }
  }
}
const tableAndFieldIdMap = {} as {
  [key: string]: {
    name: string
    fields: {
      [key: string]: {
        name: string
        config: { isUnique: boolean; isHashed: boolean }
      }
    }
  }
}

export function generateServerSchema(project: Project) {
  const schemaBuilder = []
  const queryBuilder = ['type Query {']
  const mutationBuilder = ['type Mutation {']
  if (project.appConfig.authConfig.requiresAuth) {
    mutationBuilder.push(
      `  login(username: String!, password: String!): String`
    )
    mutationBuilder.push(`  logout: Boolean!`)
    const authTable = project.appConfig.apiConfig.models.find(
      model =>
        model._id.toString() === project.appConfig.authConfig.tableId.toString()
    )
    if (authTable) {
      const name = authTable.name.replaceAll(' ', '')
      mutationBuilder.push(`  register(userData: Create${name}Input!): String`)
    }
  }
  const subscriptionBuilder = ['type Subscription {']
  const connectionsBuilder = []
  const createInputsBuilder = []
  const updateInputsBuilder = []
  const deleteInputsBuilder = []
  const filtersBuilder = []
  const conditionalBuilder = []
  project.appConfig.apiConfig.models.forEach(model => {
    const name = model.name.replaceAll(' ', '')
    tableAndFieldNameMap[name] = {
      id: model._id.toString(),
      fields: {},
    }
    tableAndFieldIdMap[model._id.toString()] = {
      name: model.name.toString(),
      fields: {},
    }
  })
  project.appConfig.apiConfig.models.forEach(model => {
    const name = model.name.replaceAll(' ', '')
    queryBuilder.push(`"A Single ${name}"`)
    queryBuilder.push(`  get${name}(_id: ID!): ${name}`)
    queryBuilder.push(`"A List of ${name}s"`)
    queryBuilder.push(
      `  list${name}(filter: Model${name}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${name}Connection`
    )
    mutationBuilder.push(`"Create a ${name}"`)
    mutationBuilder.push(
      `  create${name}(input: Create${name}Input!, condition: Model${name}ConditionalInput): ${name}`
    )
    mutationBuilder.push(`"Update a ${name}"`)
    mutationBuilder.push(
      `  update${name}(input: Update${name}Input!, condition: Model${name}ConditionalInput): ${name}`
    )
    mutationBuilder.push(`"Delete a ${name}"`)
    mutationBuilder.push(
      `  delete${name}(input: Delete${name}Input!, condition: Model${name}ConditionalInput): ${name}`
    )
    subscriptionBuilder.push(`  onCreate${name}: ${name}`)
    subscriptionBuilder.push(`  onUpdate${name}: ${name}`)
    subscriptionBuilder.push(`  onDelete${name}: ${name}`)

    const modelBuilder = []
    modelBuilder.push(`\ntype ${name} {`)
    modelBuilder.push(`  _id: ID!`)
    model.fields.forEach(field => {
      tableAndFieldNameMap[name].fields[field.fieldName.replace(' ', '')] = {
        id: field._id.toString(),
        config: {
          isUnique: field.isUnique,
          isHashed: field.isHashed,
        },
      }
      tableAndFieldIdMap[model._id.toString()].fields[field._id.toString()] = {
        name: field.fieldName.replace(' ', ''),
        config: {
          isUnique: field.isUnique,
          isHashed: field.isHashed,
        },
      }
      if (field.connection) {
        if (field.isList) {
          modelBuilder.push(
            `  ${field.fieldName.replaceAll(' ', '')}(filter: Model${
              tableAndFieldIdMap[field.dataType].name
            }FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${
              tableAndFieldIdMap[field.dataType].name
            }Connection`
          )
        } else {
          modelBuilder.push(
            `  ${field.fieldName.replaceAll(' ', '')}: ${
              tableAndFieldIdMap[field.dataType].name
            }${field.isHashed || field.nullable ? '' : '!'}`
          )
        }
      } else {
        modelBuilder.push(
          `  ${field.fieldName.replaceAll(' ', '')}: ${field.dataType}${
            field.isHashed || field.nullable ? '' : '!'
          }`
        )
      }
    })
    modelBuilder.push(`}\n`)
    filtersBuilder.push(
      generateFilterInput({
        typename: name,
        keys: model.fields
          .filter(fields => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType }) => ({
            fieldName: fieldName.replaceAll(' ', ''),
            dataType,
          })),
      })
    )
    conditionalBuilder.push(
      generateConditionalInput({
        typename: name,
        keys: model.fields
          .filter(fields => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType }) => ({
            fieldName: fieldName.replaceAll(' ', ''),
            dataType,
          })),
      })
    )
    createInputsBuilder.push(
      generateCreateInput({
        typename: name,
        keys: model.fields
          .filter(fields => !fields.isList)
          .map(({ fieldName, dataType, nullable }) => ({
            fieldName: fieldName.replaceAll(' ', ''),
            dataType,
            nullable,
          })),
      })
    )
    updateInputsBuilder.push(
      generateUpdateInput({
        typename: name,
        keys: model.fields
          .filter(fields => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType, nullable }) => ({
            fieldName: fieldName.replaceAll(' ', ''),
            dataType,
            nullable,
          })),
      })
    )
    deleteInputsBuilder.push(
      generateDeleteInput({
        typename: name,
        keys: model.fields
          .filter(fields => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType, nullable }) => ({
            fieldName: fieldName.replaceAll(' ', ''),
            dataType,
            nullable,
          })),
      })
    )
    connectionsBuilder.push(generateConnections(name))
    schemaBuilder.push(modelBuilder.join('\n'))
  })

  queryBuilder.push('}\n')
  schemaBuilder.push(queryBuilder.join('\n'))
  mutationBuilder.push('}\n')
  schemaBuilder.push(mutationBuilder.join('\n'))
  subscriptionBuilder.push('}\n')
  schemaBuilder.push(subscriptionBuilder.join('\n'))
  filtersBuilder.push('\n')
  schemaBuilder.push(filtersBuilder.join('\n'))
  conditionalBuilder.push('\n')
  schemaBuilder.push(conditionalBuilder.join('\n'))
  createInputsBuilder.push('\n')
  schemaBuilder.push(createInputsBuilder.join('\n'))
  updateInputsBuilder.push('\n')
  schemaBuilder.push(updateInputsBuilder.join('\n'))
  deleteInputsBuilder.push('\n')
  schemaBuilder.push(deleteInputsBuilder.join('\n'))
  connectionsBuilder.push('\n')
  schemaBuilder.push(connectionsBuilder.join('\n'))
  schemaBuilder.push(ModelSizeInput)
  schemaBuilder.push(ModelAttributeTypes)
  schemaBuilder.push(ModelStringInput)
  schemaBuilder.push(ModelBooleanInput)
  schemaBuilder.push(ModelIDInput)
  schemaBuilder.push(ModelSortDirection)
  return schemaBuilder.join('\n')
}
