import { Service } from "typedi";

interface GenerateFilterInputParams {
  typename: string
  keys: [{
    name: string,
    type: 'ID' | 'String' | 'Boolean' | 'Int'
  }]
}

@Service()
export class ApiService {
  public generateFilterInput({ typename, keys }: GenerateFilterInputParams) {
    const builder = []
    builder.push(`input Model${typename}FilterInput {`)
    keys.forEach(key => builder.push(`  ${key.name}: Model${key.type}Input`))
    builder.push(`  and: [Model${typename}FilterInput]`)
    builder.push(`  or: [Model${typename}FilterInput]`)
    builder.push(`  not: Model${typename}FilterInput`)
    builder.push(`}`)
    return builder.join('\n')
  }
}