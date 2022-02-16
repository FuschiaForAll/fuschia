const { ModelIDInput, ModelSizeInput, ModelAttributeTypes, ModelStringInput, ModelBooleanInput, ModelSortDirection } = require("./api.consts");
const { resolver } = require('./resolver')

function checkTypeForPrimitive(type) {
  switch (type) {
    case 'ID':
    case 'String':
    case 'Boolean':
    case 'Int':
      return true
  }
  return false
}

function generateConnections(typename) {
  const builder = []
  builder.push(`type Model${typename}Connection {`)
  builder.push(`  items: [${typename}]`)
  builder.push(`  nextToken: String`)
  builder.push(`}`)
  return builder.join('\n')
}

function generateCreateInput({ typename, keys, nullable }) {
  const builder = []
  builder.push(`input Create${typename}Input {`)
  keys.forEach(key => builder.push(`  ${key.fieldName}: ${key.dataType}${key.nullable ? '' : '!'}`))
  builder.push(`}`)
  return builder.join('\n')
}

function generateUpdateInput({ typename, keys }) {
  const builder = []
  builder.push(`input Update${typename}Input {`)
  keys.forEach(key => builder.push(`  ${key.fieldName}: ${key.dataType}${key.nullable ? '' : '!'}`))
  builder.push(`}`)
  return builder.join('\n')
}

function generateDeleteInput({ typename, keys }) {
  const builder = []
  builder.push(`input Delete${typename}Input {`)
  builder.push(`  _id: ID!`)
  builder.push(`}`)
  return builder.join('\n')
}

function generateConditionalInput({ typename, keys }) {
  const builder = []
  builder.push(`input Model${typename}ConditionalInput {`)
  keys.forEach(key => builder.push(`  ${key.fieldName}: Model${key.dataType}Input`))
  builder.push(`  and: [Model${typename}ConditionalInput]`)
  builder.push(`  or: [Model${typename}ConditionalInput]`)
  builder.push(`  not: Model${typename}ConditionalInput`)
  builder.push(`}`)
  return builder.join('\n')
}
function generateFilterInput({ typename, keys }) {
  const builder = []
  builder.push(`input Model${typename}FilterInput {`)
  builder.push(`  _id: ModelIDInput`)
  keys.forEach(key => builder.push(`  ${key.fieldName}: Model${key.dataType}Input`))
  builder.push(`  and: [Model${typename}FilterInput]`)
  builder.push(`  or: [Model${typename}FilterInput]`)
  builder.push(`  not: Model${typename}FilterInput`)
  builder.push(`}`)
  return builder.join('\n')
}

function publish(project) {
  const resolverBuilder = {
    Query: {},
    Mutation: {},
    Subscription: {}
  }
  const schemaBuilder = []
  const queryBuilder = ["type Query {"]
  const mutationBuilder = ["type Mutation {"]
  const subscriptionBuilder = ["type Subscription {"]
  const connectionsBuilder = []
  const createInputsBuilder = []
  const updateInputsBuilder = []
  const deleteInputsBuilder = []
  const filtersBuilder = []
  const conditionalBuilder = []
  project.appConfig.apiConfig.models.forEach(model => {
    const name = model.name.replace(' ', '')
    resolverBuilder.Query[`get${name}`] = (parent, args, context, info) => resolver.genericGetQueryResolver(model._id.toString(), parent, args, context, info)
    resolverBuilder.Query[`list${name}`] = (parent, args, context, info) => resolver.genericListQueryResolver(model._id.toString(), parent, args.input, context, info)
    queryBuilder.push(`  get${name}(_id: ID!): ${name}`)
    queryBuilder.push(`  list${name}(filter: Model${name}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${name}Connection`)
    mutationBuilder.push(`  create${name}(input: Create${name}Input!, condition: Model${name}ConditionalInput): ${name}`)
    resolverBuilder.Mutation[`create${name}`] = (parent, args, context, info) => resolver.genericCreateResolver(model._id.toString(), parent, args.input, context, info)
    mutationBuilder.push(`  update${name}(input: Update${name}Input!, condition: Model${name}ConditionalInput): ${name}`)
    mutationBuilder.push(`  delete${name}(input: Delete${name}Input!, condition: Model${name}ConditionalInput): ${name}`)
    resolverBuilder.Mutation[`delete${name}`] = (parent, args, context, info) => resolver.genericDeleteResolver(model._id.toString(), parent, args.input, context, info)
    subscriptionBuilder.push(`  onCreate${name}: ${name}`)
    subscriptionBuilder.push(`  onUpdate${name}: ${name}`)
    subscriptionBuilder.push(`  onDelete${name}: ${name}`)

    const modelBuilder = []
    modelBuilder.push(`\ntype ${name} {`)
    modelBuilder.push(`  _id: ID!`)
    model.fields.forEach(field => {
      if (field.connection) {
        modelBuilder.push(`  ${field.fieldName.replace(' ', '')}(filter: Model${field.dataType}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${field.dataType}Connection`)
      } else {
        modelBuilder.push(`  ${field.fieldName.replace(' ', '')}: ${field.dataType}${field.nullable ? '' : '!'}`)
      }
    })
    modelBuilder.push(`}\n`)
    filtersBuilder.push(generateFilterInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType}) => ({ fieldName: fieldName.replace(' ', ''), dataType}))}))
    conditionalBuilder.push(generateConditionalInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType}) => ({ fieldName: fieldName.replace(' ', ''), dataType}))}))
    createInputsBuilder.push(generateCreateInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType, nullable}) => ({ fieldName: fieldName.replace(' ', ''), dataType, nullable }))}))
    updateInputsBuilder.push(generateUpdateInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType, nullable}) => ({ fieldName: fieldName.replace(' ', ''), dataType, nullable }))}))
    deleteInputsBuilder.push(generateDeleteInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType, nullable}) => ({ fieldName: fieldName.replace(' ', ''), dataType, nullable }))}))
    connectionsBuilder.push(generateConnections(name))
    schemaBuilder.push(modelBuilder.join('\n'))
  })

  queryBuilder.push("}\n")
  schemaBuilder.push(queryBuilder.join('\n'))
  mutationBuilder.push("}\n")
  schemaBuilder.push(mutationBuilder.join('\n'))
  subscriptionBuilder.push("}\n")
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
  return { typeDefs: schemaBuilder.join('\n'), resolvers: resolverBuilder }
}

exports.publish = publish