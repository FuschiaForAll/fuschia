const ModelSizeInput = `
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

const ModelAttributeTypes = `
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

const ModelStringInput = `
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

const ModelBooleanInput = `
input ModelBooleanInput {
  ne: Boolean
  eq: Boolean
  attributeExists: Boolean
  attributeType: ModelAttributeTypes
}
`

const ModelSortDirection = `
enum ModelSortDirection {
  ASC
  DESC
}
`
const ModelIDInput = `
input ModelIDInput {
  ne: ID
  eq: ID
  le: ID
  lt: ID
  ge: ID
  gt: ID
  contains: ID
  notContains: ID
  between: [ID]
  beginsWith: ID
  attributeExists: Boolean
  attributeType: ModelAttributeTypes
  size: ModelSizeInput
}
`



exports.ModelSortDirection = ModelSortDirection
exports.ModelBooleanInput = ModelBooleanInput
exports.ModelStringInput = ModelStringInput
exports.ModelAttributeTypes = ModelAttributeTypes
exports.ModelSizeInput = ModelSizeInput
exports.ModelIDInput = ModelIDInput