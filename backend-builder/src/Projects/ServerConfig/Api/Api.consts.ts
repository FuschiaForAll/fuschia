export const ModelSizeInput = `
input ModelSizeInput {
  ne: Int
  eq: Int
  le: Int
  lt: Int
  ge: Int
  gt: Int
  between: [Int]
}
`

export const ModelAttributeTypes = `
enum ModelAttributeTypes {
  binary
  binarySet
  bool
  list
  map
  number
  numberSet
  string
  stringSet
  _null
}
`

export const ModelStringInput = `
input ModelStringInput {
  ne: String
  eq: String
  le: String
  lt: String
  ge: String
  gt: String
  contains: String
  notContains: String
  between: [String]
  beginsWith: String
  attributeExists: Boolean
  attributeType: ModelAttributeTypes
  size: ModelSizeInput
}
`

export const ModelBooleanInput = `
input ModelBooleanInput {
  ne: Boolean
  eq: Boolean
  attributeExists: Boolean
  attributeType: ModelAttributeTypes
}
`

export const ModelSortDirection = `
enum ModelSortDirection {
  ASC
  DESC
}
`