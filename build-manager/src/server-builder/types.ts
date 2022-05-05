export interface Field {
  _id: string
  fieldName: string
  isUnique: boolean
  isHashed: boolean
  isList: boolean
  connection?: boolean
  nullable: boolean
  dataType: string
  rules: Array<{
    allow: string
    provider: string
    ownerField: string
    identiyClaim: string
    groupClaim: string
    groups: string[]
    groupsField: string
    operations: string[]
  }>
  keys: Array<{
    name: string
    fieldNames: string[]
  }>
}

export interface Model {
  _id: string
  name: string
  isLocal: boolean
  keys: Array<{
    name: string
    fieldNames: string[]
  }>
  auth: Array<{
    allow: string
    provider: string
    ownerField: string
    identiyClaim: string
    groupClaim: string
    groups: string[]
    groupsField: string
    operations: string[]
  }>
  fields: Field[]
}

export interface JsonInputFile {
  liveJwtSecret?: string
  sandboxJwtSecret?: string
  githubUrl?: string
  apiConfig: {
    sandboxEndpoint?: string
    liveEndpoint?: string
    models: Model[]
    queries: string[]
    mutations: string[]
    subscriptions: string[]
  }
  authConfig: {
    _id: string
    requiresAuth: Boolean
    allowUnauthenticatedUsers: Boolean
    mfaEnabled: Boolean
    mfaConfiguration: 'OFF' | 'ON' | 'OPTIONAL'
    mfaTypes: 'SMS' | 'TOTP' | 'EMAIL'
    smsAuthenticationMessage: string
    smsVerificationMessage: string
    emailVerificationSubject: string
    emailVerificationMessage: string
    defaultPasswordPolicy: boolean
    passwordPolicyMinLength: number
    passwordRequiresUppercase: boolean
    passwordRequiresNumbers: boolean
    passwordRequiresSymbols: boolean
    requiredAttributes: string[]
    clientRefreshTokenValidity: number
    usernameCaseSensitive: boolean
    tableId: string
    usernameFieldId: string
    passwordFieldId: string
  }
}
