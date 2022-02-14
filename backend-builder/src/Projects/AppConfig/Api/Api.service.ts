import { Service } from "typedi";
import { ProjectModel } from "../../../Models";
import { Project } from "../../Project.entity";

interface GenerateFilterInputParams {
  typename: string
  keys: [{
    name: string,
    type: 'ID' | 'String' | 'Boolean' | 'Int'
  }]
}

@Service()
export class ApiService {
  private generateFilterInput({ typename, keys }: GenerateFilterInputParams) {
    const builder = []
    builder.push(`input Model${typename}FilterInput {`)
    keys.forEach(key => builder.push(`  ${key.name}: Model${key.type}Input`))
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
    project.appConfig.apiConfig.models.forEach(model => {
      queryBuilder.push(`  get${model.name}(id: ID!): ${model.name}`)
      queryBuilder.push(`  list${model.name}(filter: Model${model.name}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${model.name}Connection`)

      mutationBuilder.push(`  create${model.name}(input: Create${model.name}Input!, condition: Model${model.name}ConditionInput): ${model.name}`)
      mutationBuilder.push(`  update${model.name}(input: Create${model.name}Input!, condition: Model${model.name}ConditionInput): ${model.name}`)
      mutationBuilder.push(`  delete${model.name}(input: Create${model.name}Input!, condition: Model${model.name}ConditionInput): ${model.name}`)

      const modelBuilder = [] as string[]
      modelBuilder.push(`\ntype ${model.name} {`)
      model.fields.forEach(field => {
        if (field.connection) {
          modelBuilder.push(`  ${field.fieldName}(filter: Model${field.dataType}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${field.dataType}Connection`)
        } else {
          modelBuilder.push(`  ${field.fieldName}: ${field.dataType}${field.nullable ? '' : '!'}`)
        }
      })
      modelBuilder.push(`}\n`)
      schemaBuilder.push(modelBuilder.join('\n'))
    })

    queryBuilder.push("}\n")
    schemaBuilder.push(queryBuilder.join('\n'))
    mutationBuilder.push("}\n")
    schemaBuilder.push(mutationBuilder.join('\n'))
    subscriptionBuilder.push("}\n")
    schemaBuilder.push(mutationBuilder.join('\n'))
    console.log(schemaBuilder.join('\n'))
  }
}