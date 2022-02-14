import { Service } from "typedi";
import { ProjectModel } from "../../../Models";
import { Project } from "../../Project.entity";
import { ModelSizeInput, ModelAttributeTypes, ModelStringInput, ModelBooleanInput, ModelSortDirection } from "./Api.consts";

interface GenerateInputParams {
  typename: string
  keys: Array<{
    fieldName: string,
    dataType: 'ID' | 'String' | 'Boolean' | 'Int'
  }>,
}


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

@Service()
export class ApiService {
  private generateConditionalInput({ typename, keys }: GenerateInputParams) {
    const builder = []
    builder.push(`input Model${typename}ConditionalInput {`)
    keys.forEach(key => builder.push(`  ${key.fieldName}: Model${key.dataType}Input`))
    builder.push(`  and: [Model${typename}ConditionalInput]`)
    builder.push(`  or: [Model${typename}ConditionalInput]`)
    builder.push(`  not: Model${typename}ConditionalInput`)
    builder.push(`}`)
    return builder.join('\n')
  }
  private generateFilterInput({ typename, keys }: GenerateInputParams) {
    const builder = []
    builder.push(`input Model${typename}FilterInput {`)
    builder.push(`  id: ModelIDInput`)
    keys.forEach(key => builder.push(`  ${key.fieldName}: Model${key.dataType}Input`))
    builder.push(`  and: [Model${typename}FilterInput]`)
    builder.push(`  or: [Model${typename}FilterInput]`)
    builder.push(`  not: Model${typename}FilterInput`)
    builder.push(`}`)
    return builder.join('\n')
  }

  public publish(project: Project) {
    const schemaBuilder = [] as string[]
    const queryBuilder = ["type Query {"] as string[]
    const mutationBuilder = ["type Mutation {"] as string[]
    const subscriptionBuilder = ["type Subscription {"] as string[]
    const connectionsBuilder = [] as string[]
    const inputsBuilder = [] as string[]
    const filtersBuilder = [] as string[]
    const conditionalBuilder = [] as string[]
    project.appConfig.apiConfig.models.forEach(model => {
      const name = model.name.replace(' ', '')
      queryBuilder.push(`  get${name}(id: ID!): ${name}`)
      queryBuilder.push(`  list${name}(filter: Model${name}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${name}Connection`)

      mutationBuilder.push(`  create${name}(input: Create${name}Input!, condition: Model${name}ConditionInput): ${name}`)
      mutationBuilder.push(`  update${name}(input: Create${name}Input!, condition: Model${name}ConditionInput): ${name}`)
      mutationBuilder.push(`  delete${name}(input: Create${name}Input!, condition: Model${name}ConditionInput): ${name}`)

      subscriptionBuilder.push(`  onCreate${name}: ${name}`)
      subscriptionBuilder.push(`  onUpdate${name}: ${name}`)
      subscriptionBuilder.push(`  onDelete${name}: ${name}`)


      const modelBuilder = [] as string[]
      modelBuilder.push(`\ntype ${name} {`)
      model.fields.forEach(field => {
        if (field.connection) {
          modelBuilder.push(`  ${field.fieldName.replace(' ', '')}(filter: Model${field.dataType}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${field.dataType}Connection`)
        } else {
          modelBuilder.push(`  ${field.fieldName.replace(' ', '')}: ${field.dataType}${field.nullable ? '' : '!'}`)
        }
      })
      modelBuilder.push(`}\n`)
      filtersBuilder.push(this.generateFilterInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType}) => ({ fieldName: fieldName.replace(' ', ''), dataType: dataType as 'ID' | 'String' | 'Boolean' | 'Int' }))}))
      conditionalBuilder.push(this.generateConditionalInput({ typename: name, keys: model.fields.filter(fields => checkTypeForPrimitive(fields.dataType)).map(({fieldName, dataType}) => ({ fieldName: fieldName.replace(' ', ''), dataType: dataType as 'ID' | 'String' | 'Boolean' | 'Int' }))}))
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
    schemaBuilder.push(ModelSizeInput)
    schemaBuilder.push(ModelAttributeTypes)
    schemaBuilder.push(ModelStringInput)
    schemaBuilder.push(ModelBooleanInput)
    schemaBuilder.push(ModelSortDirection)
    console.log(schemaBuilder.join('\n'))
  }
}