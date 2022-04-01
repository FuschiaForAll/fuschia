import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** Mongo object id scalar type */
  ObjectId: any;
};

export type Api = {
  __typename?: 'Api';
  liveEndpoint?: Maybe<Scalars['String']>;
  models: Array<EntityModel>;
  mutations: Array<Scalars['String']>;
  queries: Array<Scalars['String']>;
  sandboxEndpoint?: Maybe<Scalars['String']>;
  subscriptions: Array<Scalars['String']>;
};

export type AppConfig = {
  __typename?: 'AppConfig';
  apiConfig: Api;
  appEntryComponentId?: Maybe<Scalars['ObjectId']>;
  authConfig: Auth;
};

export type AppConfigInput = {
  appEntryComponentId?: InputMaybe<Scalars['ObjectId']>;
};

export type Auth = {
  __typename?: 'Auth';
  _id: Scalars['ObjectId'];
  allowUnauthenticatedUsers: Scalars['Boolean'];
  clientRefreshTokenValidity: Scalars['Float'];
  defaultPasswordPolicy: Scalars['Boolean'];
  emailVerificationMessage: Scalars['String'];
  emailVerificationSubject: Scalars['String'];
  mfaConfiguration: Scalars['String'];
  mfaEnabled: Scalars['Boolean'];
  mfaTypes: Scalars['String'];
  passwordFieldId: Scalars['String'];
  passwordPolicyMinLength: Scalars['Float'];
  passwordRequiresNumbers: Scalars['Boolean'];
  passwordRequiresSymbols: Scalars['Boolean'];
  passwordRequiresUppercase: Scalars['Boolean'];
  requiredAttributes: Array<Scalars['String']>;
  requiresAuth: Scalars['Boolean'];
  smsAuthenticationMessage: Scalars['String'];
  smsVerificationMessage: Scalars['String'];
  tableId: Scalars['String'];
  usernameCaseSensitive: Scalars['Boolean'];
  usernameFieldId: Scalars['String'];
};

export type AuthInput = {
  allowUnauthenticatedUsers?: InputMaybe<Scalars['Boolean']>;
  clientRefreshTokenValidity?: InputMaybe<Scalars['Float']>;
  defaultPasswordPolicy?: InputMaybe<Scalars['Boolean']>;
  emailVerificationMessage?: InputMaybe<Scalars['String']>;
  emailVerificationSubject?: InputMaybe<Scalars['String']>;
  mfaConfiguration?: InputMaybe<Scalars['String']>;
  mfaEnabled?: InputMaybe<Scalars['Boolean']>;
  mfaTypes?: InputMaybe<Scalars['String']>;
  passwordFieldId?: InputMaybe<Scalars['String']>;
  passwordPolicyMinLength?: InputMaybe<Scalars['Float']>;
  passwordRequiresNumbers?: InputMaybe<Scalars['Boolean']>;
  passwordRequiresSymbols?: InputMaybe<Scalars['Boolean']>;
  passwordRequiresUppercase?: InputMaybe<Scalars['Boolean']>;
  requiredAttributes?: InputMaybe<Array<Scalars['String']>>;
  requiresAuth?: InputMaybe<Scalars['Boolean']>;
  smsAuthenticationMessage?: InputMaybe<Scalars['String']>;
  smsVerificationMessage?: InputMaybe<Scalars['String']>;
  tableId?: InputMaybe<Scalars['String']>;
  usernameCaseSensitive?: InputMaybe<Scalars['Boolean']>;
  usernameFieldId?: InputMaybe<Scalars['String']>;
};

export type BindingContext = {
  __typename?: 'BindingContext';
  menu: Array<MenuStructure>;
  structure: Array<DataStructure>;
};

export type Component = {
  __typename?: 'Component';
  _id: Scalars['ObjectId'];
  children?: Maybe<Array<Component>>;
  data?: Maybe<Scalars['JSONObject']>;
  fetched?: Maybe<Array<DataSource>>;
  isContainer: Scalars['Boolean'];
  isRootElement: Scalars['Boolean'];
  name: Scalars['String'];
  package: Scalars['String'];
  parameters?: Maybe<Array<RequiredParameter>>;
  parent?: Maybe<Component>;
  props?: Maybe<Scalars['JSONObject']>;
  type: Scalars['String'];
  x?: Maybe<Scalars['Float']>;
  y?: Maybe<Scalars['Float']>;
};

export type ComponentInput = {
  children?: InputMaybe<Array<Scalars['ObjectId']>>;
  data?: InputMaybe<Scalars['JSONObject']>;
  fetched?: InputMaybe<Array<DataSourceInput>>;
  isContainer?: InputMaybe<Scalars['Boolean']>;
  isRootElement?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  package?: InputMaybe<Scalars['String']>;
  parameters?: InputMaybe<Array<RequiredParameterInput>>;
  parent?: InputMaybe<Scalars['ObjectId']>;
  props?: InputMaybe<Scalars['JSONObject']>;
  type?: InputMaybe<Scalars['String']>;
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
};

export type DataAuth = {
  __typename?: 'DataAuth';
  allow: Scalars['String'];
  groupClaim: Scalars['String'];
  groups: Array<Scalars['String']>;
  groupsField: Scalars['String'];
  identityClaim: Scalars['String'];
  operations: Array<Scalars['String']>;
  ownerField: Scalars['String'];
  provider: Scalars['String'];
};

export type DataContext = {
  __typename?: 'DataContext';
  componentId: Scalars['String'];
  dataSources: Array<Scalars['String']>;
  name: Scalars['String'];
};

export type DataField = {
  __typename?: 'DataField';
  _id: Scalars['ObjectId'];
  connection?: Maybe<Scalars['Boolean']>;
  dataType: Scalars['String'];
  fieldName: Scalars['String'];
  isHashed: Scalars['Boolean'];
  isList?: Maybe<Scalars['Boolean']>;
  isUnique: Scalars['Boolean'];
  keys: Array<Key>;
  nullable: Scalars['Boolean'];
  rules: Array<DataAuth>;
};

export type DataFieldInput = {
  dataType: Scalars['String'];
  fieldName: Scalars['String'];
  isHashed: Scalars['Boolean'];
  isList: Scalars['Boolean'];
  isUnique: Scalars['Boolean'];
  nullable: Scalars['Boolean'];
};

export type DataSource = {
  __typename?: 'DataSource';
  type: Scalars['String'];
  variables: Array<Scalars['JSONObject']>;
};

export type DataSourceInput = {
  type: Scalars['String'];
  variables: Array<Scalars['JSONObject']>;
};

export type DataStructure = {
  __typename?: 'DataStructure';
  _id: Scalars['String'];
  fields: Array<DataStructureField>;
  name: Scalars['String'];
};

export type DataStructureField = {
  __typename?: 'DataStructureField';
  dataType: Scalars['String'];
  hasSubMenu: Scalars['Boolean'];
  key: Scalars['String'];
  name: Scalars['String'];
};

export type EntityModel = {
  __typename?: 'EntityModel';
  _id: Scalars['ObjectId'];
  auth: Array<DataAuth>;
  fields: Array<DataField>;
  keys: Array<Key>;
  name: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Key = {
  __typename?: 'Key';
  fieldNames: Array<Scalars['String']>;
  name: Scalars['String'];
};

export type LabelLibrary = {
  __typename?: 'LabelLibrary';
  labelTags: Array<LabelTag>;
  languages: Array<Language>;
  translations: Array<LanguageTranslation>;
};

export type LabelTag = {
  __typename?: 'LabelTag';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  numberOfStates: Scalars['Float'];
};

export type Language = {
  __typename?: 'Language';
  _id: Scalars['ObjectId'];
  code: Scalars['String'];
  name: Scalars['String'];
};

export type LanguageTranslation = {
  __typename?: 'LanguageTranslation';
  language: Scalars['ObjectId'];
  translations: Array<Translation>;
};

export type MenuStructure = {
  __typename?: 'MenuStructure';
  entity: Scalars['String'];
  hasSubMenu: Scalars['Boolean'];
  label: Scalars['String'];
  source: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addParameter: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  createComponent: Component;
  createDataField?: Maybe<DataField>;
  createEntityModel?: Maybe<EntityModel>;
  createLabelTag: Project;
  createLanguage: Project;
  createMutation?: Maybe<Scalars['Boolean']>;
  createOrganization: Organization;
  createPackage: Package;
  createProject: Project;
  createQuery?: Maybe<Scalars['Boolean']>;
  createRelationship?: Maybe<Scalars['Boolean']>;
  createSubscription?: Maybe<Scalars['Boolean']>;
  createTranslation: Project;
  createUser: User;
  deleteComponents: Array<Scalars['ObjectId']>;
  deleteDataField?: Maybe<Scalars['ObjectId']>;
  deleteEntityModel?: Maybe<Scalars['ObjectId']>;
  deleteMutations?: Maybe<Scalars['Boolean']>;
  deleteOrganization: Scalars['ObjectId'];
  deleteProject: Scalars['ObjectId'];
  deleteQuery?: Maybe<Scalars['Boolean']>;
  deleteRelationship?: Maybe<Scalars['Boolean']>;
  deleteSubscription?: Maybe<Scalars['Boolean']>;
  duplicateComponent: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  publishApi: Scalars['Boolean'];
  publishPackageComponents: Array<PackageComponent>;
  register: UserResponse;
  removeParameter: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  updateAppConfig: Scalars['Boolean'];
  updateAuth?: Maybe<Auth>;
  updateComponent: Component;
  updateComponentProps: Component;
  updateEntityModel?: Maybe<Scalars['Boolean']>;
  updateMe: User;
  updateMutation?: Maybe<Scalars['Boolean']>;
  updateParameter: Scalars['Boolean'];
  updateProject: Project;
  updateQuery?: Maybe<Scalars['Boolean']>;
  updateRelationship?: Maybe<Scalars['Boolean']>;
  updateSubscription?: Maybe<Scalars['Boolean']>;
  updateTranslation: Project;
};


export type MutationAddParameterArgs = {
  componentId: Scalars['ObjectId'];
  parameterInput: RequiredParameterInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateComponentArgs = {
  componentInput: ComponentInput;
  projectId: Scalars['ObjectId'];
};


export type MutationCreateDataFieldArgs = {
  dataField: DataFieldInput;
  entityModelId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
};


export type MutationCreateEntityModelArgs = {
  name: Scalars['String'];
  projectId: Scalars['ObjectId'];
};


export type MutationCreateLabelTagArgs = {
  numberOfStates: Scalars['Int'];
  projectId: Scalars['ObjectId'];
  tagName: Scalars['String'];
};


export type MutationCreateLanguageArgs = {
  languageCode: Scalars['String'];
  languageName: Scalars['String'];
  projectId: Scalars['ObjectId'];
};


export type MutationCreateOrganizationArgs = {
  organization: OrganizationInput;
};


export type MutationCreatePackageArgs = {
  packageInput: PackageInput;
};


export type MutationCreateProjectArgs = {
  project: ProjectInput;
};


export type MutationCreateTranslationArgs = {
  languageId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
  tagId: Scalars['ObjectId'];
  translations: Array<Scalars['String']>;
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationDeleteComponentsArgs = {
  componentIds: Array<Scalars['ObjectId']>;
  projectId: Scalars['ObjectId'];
};


export type MutationDeleteDataFieldArgs = {
  dataFieldId: Scalars['ObjectId'];
  entityModelId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
};


export type MutationDeleteEntityModelArgs = {
  entityModelId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
};


export type MutationDeleteOrganizationArgs = {
  organizationId: Scalars['ObjectId'];
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['ObjectId'];
};


export type MutationDuplicateComponentArgs = {
  componentId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPublishApiArgs = {
  projectId: Scalars['ObjectId'];
  sandbox: Scalars['Boolean'];
};


export type MutationPublishPackageComponentsArgs = {
  componentInput: Array<PackageComponentInput>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveParameterArgs = {
  componentId: Scalars['ObjectId'];
  parameterId: Scalars['ObjectId'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUpdateAppConfigArgs = {
  appConfig: AppConfigInput;
  projectId: Scalars['ObjectId'];
};


export type MutationUpdateAuthArgs = {
  input: AuthInput;
  projectId: Scalars['ObjectId'];
};


export type MutationUpdateComponentArgs = {
  componentId: Scalars['ObjectId'];
  componentInput: ComponentInput;
};


export type MutationUpdateComponentPropsArgs = {
  componentId: Scalars['ObjectId'];
  props: Scalars['JSONObject'];
};


export type MutationUpdateMeArgs = {
  userInput: UserInput;
};


export type MutationUpdateParameterArgs = {
  componentId: Scalars['ObjectId'];
  parameterId: Scalars['ObjectId'];
  parameterInput: RequiredParameterInput;
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
  projectId: Scalars['ObjectId'];
};


export type MutationUpdateTranslationArgs = {
  languageId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
  tagId: Scalars['ObjectId'];
  translations: Array<Scalars['String']>;
};

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ObjectId'];
  members: Array<User>;
  name: Scalars['String'];
  owner: User;
  projects: Project;
};

export type OrganizationInput = {
  name: Scalars['String'];
};

export type Package = {
  __typename?: 'Package';
  _id: Scalars['ObjectId'];
  authorId: Scalars['ObjectId'];
  bundle: Scalars['String'];
  components: Array<PackageComponent>;
  packageName: Scalars['String'];
  repositoryUrl: Scalars['String'];
  scope: PackageScope;
  version: Scalars['String'];
};

export type PackageComponent = {
  __typename?: 'PackageComponent';
  _id: Scalars['ObjectId'];
  defaultValue: Scalars['JSONObject'];
  icon: Scalars['String'];
  isContainer: Scalars['Boolean'];
  isRootElement: Scalars['Boolean'];
  name: Scalars['String'];
  schema: Scalars['JSONObject'];
};

export type PackageComponentInput = {
  defaultValue: Scalars['JSONObject'];
  icon: Scalars['String'];
  isContainer: Scalars['Boolean'];
  isRootElement: Scalars['Boolean'];
  name: Scalars['String'];
  schema: Scalars['JSONObject'];
};

export type PackageInput = {
  authorId: Scalars['ObjectId'];
  bundle: Scalars['String'];
  components: Array<PackageComponentInput>;
  packageName: Scalars['String'];
  repositoryUrl: Scalars['String'];
  scope: PackageScope;
  version: Scalars['String'];
};

/** The scope of the package. Globals are default available to everyone, Public are usable by everyone, Private is usable by permissions */
export enum PackageScope {
  Global = 'Global',
  Private = 'Private',
  Public = 'Public'
}

export type Project = {
  __typename?: 'Project';
  _id: Scalars['ObjectId'];
  appConfig: AppConfig;
  appId: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  components: Array<Component>;
  labelLibrary: LabelLibrary;
  organization: Organization;
  projectName: Scalars['String'];
};

export type ProjectInput = {
  body?: InputMaybe<Scalars['String']>;
  organizationId: Scalars['ObjectId'];
  projectName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAuth?: Maybe<Auth>;
  getBindingTree: BindingContext;
  getComponent?: Maybe<Component>;
  getComponents: Array<Component>;
  getDataContext: Array<DataContext>;
  getEntityModel?: Maybe<EntityModel>;
  getLabelLibrary?: Maybe<LabelLibrary>;
  getPackageComponents: Array<PackageComponent>;
  getPackages: Array<Package>;
  getProject: Project;
  getServerStatus: Scalars['Boolean'];
  listEntityModel?: Maybe<Scalars['Boolean']>;
  listMutations?: Maybe<Scalars['Boolean']>;
  listOrganizations: Array<Organization>;
  listProjects: Array<Project>;
  listQueries?: Maybe<Scalars['Boolean']>;
  listRelationships?: Maybe<Scalars['Boolean']>;
  listSubscriptions?: Maybe<Scalars['Boolean']>;
  me?: Maybe<User>;
  retrieveMutation?: Maybe<Scalars['Boolean']>;
  retrieveQuery?: Maybe<Scalars['Boolean']>;
  retrieveRelationship?: Maybe<Scalars['Boolean']>;
  retrieveSubscription?: Maybe<Scalars['Boolean']>;
};


export type QueryGetAuthArgs = {
  projectId: Scalars['ObjectId'];
};


export type QueryGetBindingTreeArgs = {
  componentId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
};


export type QueryGetComponentArgs = {
  componentId: Scalars['ObjectId'];
};


export type QueryGetComponentsArgs = {
  projectId: Scalars['ObjectId'];
};


export type QueryGetDataContextArgs = {
  componentId: Scalars['ObjectId'];
};


export type QueryGetEntityModelArgs = {
  entityModelId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
};


export type QueryGetLabelLibraryArgs = {
  projectId: Scalars['ObjectId'];
};


export type QueryGetProjectArgs = {
  projectId: Scalars['ObjectId'];
};


export type QueryGetServerStatusArgs = {
  projectId: Scalars['ObjectId'];
  sandbox: Scalars['Boolean'];
};

export type RequiredParameter = {
  __typename?: 'RequiredParameter';
  _id: Scalars['ObjectId'];
  entityId: Scalars['ObjectId'];
  name: Scalars['String'];
};

export type RequiredParameterInput = {
  entityId: Scalars['ObjectId'];
  name: Scalars['String'];
};

export type Translation = {
  __typename?: 'Translation';
  tag: Scalars['ObjectId'];
  value: Array<Scalars['String']>;
};

export type UpdateProjectInput = {
  body: Scalars['String'];
  projectName?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  email: Scalars['String'];
  fullName?: Maybe<Scalars['String']>;
  lastLogin?: Maybe<Scalars['DateTime']>;
  organizations: Array<Organization>;
  status: Scalars['String'];
  userRole: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['String'];
  fullName?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  sessionId?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

/**
 * A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.
 *
 * In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.
 */
export type __Directive = {
  __typename?: '__Directive';
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  isRepeatable: Scalars['Boolean'];
  locations: Array<__DirectiveLocation>;
  args: Array<__InputValue>;
};


/**
 * A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.
 *
 * In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.
 */
export type __DirectiveArgsArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};

/** A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies. */
export enum __DirectiveLocation {
  /** Location adjacent to a query operation. */
  Query = 'QUERY',
  /** Location adjacent to a mutation operation. */
  Mutation = 'MUTATION',
  /** Location adjacent to a subscription operation. */
  Subscription = 'SUBSCRIPTION',
  /** Location adjacent to a field. */
  Field = 'FIELD',
  /** Location adjacent to a fragment definition. */
  FragmentDefinition = 'FRAGMENT_DEFINITION',
  /** Location adjacent to a fragment spread. */
  FragmentSpread = 'FRAGMENT_SPREAD',
  /** Location adjacent to an inline fragment. */
  InlineFragment = 'INLINE_FRAGMENT',
  /** Location adjacent to a variable definition. */
  VariableDefinition = 'VARIABLE_DEFINITION',
  /** Location adjacent to a schema definition. */
  Schema = 'SCHEMA',
  /** Location adjacent to a scalar definition. */
  Scalar = 'SCALAR',
  /** Location adjacent to an object type definition. */
  Object = 'OBJECT',
  /** Location adjacent to a field definition. */
  FieldDefinition = 'FIELD_DEFINITION',
  /** Location adjacent to an argument definition. */
  ArgumentDefinition = 'ARGUMENT_DEFINITION',
  /** Location adjacent to an interface definition. */
  Interface = 'INTERFACE',
  /** Location adjacent to a union definition. */
  Union = 'UNION',
  /** Location adjacent to an enum definition. */
  Enum = 'ENUM',
  /** Location adjacent to an enum value definition. */
  EnumValue = 'ENUM_VALUE',
  /** Location adjacent to an input object type definition. */
  InputObject = 'INPUT_OBJECT',
  /** Location adjacent to an input object field definition. */
  InputFieldDefinition = 'INPUT_FIELD_DEFINITION'
}

/** One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string. */
export type __EnumValue = {
  __typename?: '__EnumValue';
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  isDeprecated: Scalars['Boolean'];
  deprecationReason?: Maybe<Scalars['String']>;
};

/** Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type. */
export type __Field = {
  __typename?: '__Field';
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  args: Array<__InputValue>;
  type: __Type;
  isDeprecated: Scalars['Boolean'];
  deprecationReason?: Maybe<Scalars['String']>;
};


/** Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type. */
export type __FieldArgsArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};

/** Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value. */
export type __InputValue = {
  __typename?: '__InputValue';
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type: __Type;
  /** A GraphQL-formatted string representing the default value for this input value. */
  defaultValue?: Maybe<Scalars['String']>;
  isDeprecated: Scalars['Boolean'];
  deprecationReason?: Maybe<Scalars['String']>;
};

/** A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations. */
export type __Schema = {
  __typename?: '__Schema';
  description?: Maybe<Scalars['String']>;
  /** A list of all types supported by this server. */
  types: Array<__Type>;
  /** The type that query operations will be rooted at. */
  queryType: __Type;
  /** If this server supports mutation, the type that mutation operations will be rooted at. */
  mutationType?: Maybe<__Type>;
  /** If this server support subscription, the type that subscription operations will be rooted at. */
  subscriptionType?: Maybe<__Type>;
  /** A list of all directives supported by this server. */
  directives: Array<__Directive>;
};

/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByUrl`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.
 */
export type __Type = {
  __typename?: '__Type';
  kind: __TypeKind;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  specifiedByUrl?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<__Field>>;
  interfaces?: Maybe<Array<__Type>>;
  possibleTypes?: Maybe<Array<__Type>>;
  enumValues?: Maybe<Array<__EnumValue>>;
  inputFields?: Maybe<Array<__InputValue>>;
  ofType?: Maybe<__Type>;
};


/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByUrl`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.
 */
export type __TypeFieldsArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};


/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByUrl`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.
 */
export type __TypeEnumValuesArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};


/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByUrl`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.
 */
export type __TypeInputFieldsArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};

/** An enum describing what kind of type a given `__Type` is. */
export enum __TypeKind {
  /** Indicates this type is a scalar. */
  Scalar = 'SCALAR',
  /** Indicates this type is an object. `fields` and `interfaces` are valid fields. */
  Object = 'OBJECT',
  /** Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields. */
  Interface = 'INTERFACE',
  /** Indicates this type is a union. `possibleTypes` is a valid field. */
  Union = 'UNION',
  /** Indicates this type is an enum. `enumValues` is a valid field. */
  Enum = 'ENUM',
  /** Indicates this type is an input object. `inputFields` is a valid field. */
  InputObject = 'INPUT_OBJECT',
  /** Indicates this type is a list. `ofType` is a valid field. */
  List = 'LIST',
  /** Indicates this type is a non-null. `ofType` is a valid field. */
  NonNull = 'NON_NULL'
}

export type AddParameterMutationVariables = Exact<{
  componentId: Scalars['ObjectId'];
  parameterInput: RequiredParameterInput;
}>;


export type AddParameterMutation = { __typename?: 'Mutation', addParameter: boolean };

export type ComponentFragmentFragment = { __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null };

export type CreateComponentMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  componentInput: ComponentInput;
}>;


export type CreateComponentMutation = { __typename?: 'Mutation', createComponent: { __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null } };

export type DeleteComponentsMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  componentIds: Array<Scalars['ObjectId']> | Scalars['ObjectId'];
}>;


export type DeleteComponentsMutation = { __typename?: 'Mutation', deleteComponents: Array<any> };

export type DuplicateComponentMutationVariables = Exact<{
  componentId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
}>;


export type DuplicateComponentMutation = { __typename?: 'Mutation', duplicateComponent: boolean };

export type GetBindingTreeQueryVariables = Exact<{
  componentId: Scalars['ObjectId'];
  projectId: Scalars['ObjectId'];
}>;


export type GetBindingTreeQuery = { __typename?: 'Query', getBindingTree: { __typename?: 'BindingContext', menu: Array<{ __typename?: 'MenuStructure', entity: string, hasSubMenu: boolean, label: string, source: string }>, structure: Array<{ __typename?: 'DataStructure', _id: string, name: string, fields: Array<{ __typename?: 'DataStructureField', dataType: string, hasSubMenu: boolean, key: string, name: string }> }> } };

export type GetComponentQueryVariables = Exact<{
  componentId: Scalars['ObjectId'];
}>;


export type GetComponentQuery = { __typename?: 'Query', getComponent?: { __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null } | null };

export type GetDataContextQueryVariables = Exact<{
  componentId: Scalars['ObjectId'];
}>;


export type GetDataContextQuery = { __typename?: 'Query', getDataContext: Array<{ __typename?: 'DataContext', componentId: string, name: string, dataSources: Array<string> }> };

export type GetComponentsQueryVariables = Exact<{
  projectId: Scalars['ObjectId'];
}>;


export type GetComponentsQuery = { __typename?: 'Query', getComponents: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, children?: Array<{ __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null }> };

export type GetEntityModelQueryVariables = Exact<{
  projectId: Scalars['ObjectId'];
  entityModelId: Scalars['ObjectId'];
}>;


export type GetEntityModelQuery = { __typename?: 'Query', getEntityModel?: { __typename?: 'EntityModel', _id: any, name: string, fields: Array<{ __typename?: 'DataField', _id: any, fieldName: string, isUnique: boolean, isHashed: boolean, isList?: boolean | null, connection?: boolean | null, nullable: boolean, dataType: string }> } | null };

export type RemoveParameterMutationVariables = Exact<{
  componentId: Scalars['ObjectId'];
  parameterId: Scalars['ObjectId'];
}>;


export type RemoveParameterMutation = { __typename?: 'Mutation', removeParameter: boolean };

export type UpdateComponentMutationVariables = Exact<{
  componentId: Scalars['ObjectId'];
  componentInput: ComponentInput;
}>;


export type UpdateComponentMutation = { __typename?: 'Mutation', updateComponent: { __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null } };

export type UpdateComponentPropsMutationVariables = Exact<{
  componentId: Scalars['ObjectId'];
  props: Scalars['JSONObject'];
}>;


export type UpdateComponentPropsMutation = { __typename?: 'Mutation', updateComponentProps: { __typename?: 'Component', _id: any, package: string, type: string, name: string, x?: number | null, y?: number | null, isContainer: boolean, isRootElement: boolean, props?: any | null, data?: any | null, parameters?: Array<{ __typename?: 'RequiredParameter', _id: any, entityId: any, name: string }> | null, fetched?: Array<{ __typename?: 'DataSource', type: string, variables: Array<any> }> | null, parent?: { __typename?: 'Component', _id: any } | null } };

export type UpdateParameterMutationVariables = Exact<{
  componentId: Scalars['ObjectId'];
  parameterId: Scalars['ObjectId'];
  parameterInput: RequiredParameterInput;
}>;


export type UpdateParameterMutation = { __typename?: 'Mutation', updateParameter: boolean };

export type CreateDataFieldMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  entityModelId: Scalars['ObjectId'];
  dataField: DataFieldInput;
}>;


export type CreateDataFieldMutation = { __typename?: 'Mutation', createDataField?: { __typename?: 'DataField', _id: any, fieldName: string, isUnique: boolean, isHashed: boolean, isList?: boolean | null, nullable: boolean, connection?: boolean | null, dataType: string, rules: Array<{ __typename?: 'DataAuth', allow: string, provider: string, ownerField: string, identityClaim: string, groupClaim: string, groups: Array<string>, groupsField: string, operations: Array<string> }>, keys: Array<{ __typename?: 'Key', name: string, fieldNames: Array<string> }> } | null };

export type DeleteDataFieldMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  entityModelId: Scalars['ObjectId'];
  dataFieldId: Scalars['ObjectId'];
}>;


export type DeleteDataFieldMutation = { __typename?: 'Mutation', deleteDataField?: any | null };

export type CreateEntityModelMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  name: Scalars['String'];
}>;


export type CreateEntityModelMutation = { __typename?: 'Mutation', createEntityModel?: { __typename?: 'EntityModel', _id: any, name: string } | null };

export type DeleteEntityModelMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  entityModelId: Scalars['ObjectId'];
}>;


export type DeleteEntityModelMutation = { __typename?: 'Mutation', deleteEntityModel?: any | null };

export type FullTypeFragment = { __typename?: '__Type', kind: __TypeKind, name?: string | null, fields?: Array<{ __typename?: '__Field', name: string, isDeprecated: boolean, deprecationReason?: string | null, args: Array<{ __typename?: '__InputValue', name: string, defaultValue?: string | null, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }>, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }> | null, inputFields?: Array<{ __typename?: '__InputValue', name: string, defaultValue?: string | null, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }> | null, interfaces?: Array<{ __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null }> | null, enumValues?: Array<{ __typename?: '__EnumValue', name: string, isDeprecated: boolean, deprecationReason?: string | null }> | null, possibleTypes?: Array<{ __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null }> | null };

export type InputValueFragment = { __typename?: '__InputValue', name: string, defaultValue?: string | null, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } };

export type IntrospectionQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type IntrospectionQueryQuery = { __typename?: 'Query', __schema: { __typename?: '__Schema', queryType: { __typename?: '__Type', name?: string | null }, mutationType?: { __typename?: '__Type', name?: string | null } | null, subscriptionType?: { __typename?: '__Type', name?: string | null } | null, types: Array<{ __typename?: '__Type', kind: __TypeKind, name?: string | null, fields?: Array<{ __typename?: '__Field', name: string, isDeprecated: boolean, deprecationReason?: string | null, args: Array<{ __typename?: '__InputValue', name: string, defaultValue?: string | null, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }>, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }> | null, inputFields?: Array<{ __typename?: '__InputValue', name: string, defaultValue?: string | null, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }> | null, interfaces?: Array<{ __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null }> | null, enumValues?: Array<{ __typename?: '__EnumValue', name: string, isDeprecated: boolean, deprecationReason?: string | null }> | null, possibleTypes?: Array<{ __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null }> | null }>, directives: Array<{ __typename?: '__Directive', name: string, locations: Array<__DirectiveLocation>, args: Array<{ __typename?: '__InputValue', name: string, defaultValue?: string | null, type: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null } }> }> } };

export type TypeRefFragment = { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null, ofType?: { __typename?: '__Type', kind: __TypeKind, name?: string | null } | null } | null } | null } | null } | null } | null } | null };

export type CreateLabelTagMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  tagName: Scalars['String'];
  numberOfStates: Scalars['Int'];
}>;


export type CreateLabelTagMutation = { __typename?: 'Mutation', createLabelTag: { __typename?: 'Project', _id: any } };

export type CreateLangaugeMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  languageName: Scalars['String'];
  languageCode: Scalars['String'];
}>;


export type CreateLangaugeMutation = { __typename?: 'Mutation', createLanguage: { __typename?: 'Project', _id: any } };

export type CreateTranslationMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  languageId: Scalars['ObjectId'];
  tagId: Scalars['ObjectId'];
  translations: Array<Scalars['String']> | Scalars['String'];
}>;


export type CreateTranslationMutation = { __typename?: 'Mutation', createTranslation: { __typename?: 'Project', _id: any } };

export type GetLabelLibraryQueryVariables = Exact<{
  projectId: Scalars['ObjectId'];
}>;


export type GetLabelLibraryQuery = { __typename?: 'Query', getLabelLibrary?: { __typename?: 'LabelLibrary', languages: Array<{ __typename?: 'Language', _id: any, name: string, code: string }>, translations: Array<{ __typename?: 'LanguageTranslation', language: any, translations: Array<{ __typename?: 'Translation', tag: any, value: Array<string> }> }>, labelTags: Array<{ __typename?: 'LabelTag', _id: any, name: string, numberOfStates: number }> } | null };

export type UpdateTranslationMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  languageId: Scalars['ObjectId'];
  tagId: Scalars['ObjectId'];
  translations: Array<Scalars['String']> | Scalars['String'];
}>;


export type UpdateTranslationMutation = { __typename?: 'Mutation', updateTranslation: { __typename?: 'Project', _id: any } };

export type CreateOrganizationMutationVariables = Exact<{
  organization: OrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'Organization', _id: any, name: string, owner: { __typename?: 'User', _id: any }, members: Array<{ __typename?: 'User', _id: any, email: string }> } };

export type DeleteOrganizationMutationVariables = Exact<{
  organizationId: Scalars['ObjectId'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization: any };

export type ListOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListOrganizationsQuery = { __typename?: 'Query', listOrganizations: Array<{ __typename?: 'Organization', _id: any, name: string, owner: { __typename?: 'User', _id: any }, members: Array<{ __typename?: 'User', _id: any, email: string }> }> };

export type GetPackagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPackagesQuery = { __typename?: 'Query', getPackages: Array<{ __typename?: 'Package', _id: any, packageName: string, repositoryUrl: string, version: string, bundle: string, authorId: any, scope: PackageScope, components: Array<{ __typename?: 'PackageComponent', _id: any, name: string, schema: any, defaultValue: any, icon: string, isRootElement: boolean, isContainer: boolean }> }> };

export type AuthFragmentFragment = { __typename?: 'Auth', _id: any, requiresAuth: boolean, allowUnauthenticatedUsers: boolean, mfaEnabled: boolean, mfaConfiguration: string, mfaTypes: string, smsAuthenticationMessage: string, smsVerificationMessage: string, emailVerificationSubject: string, emailVerificationMessage: string, defaultPasswordPolicy: boolean, passwordPolicyMinLength: number, passwordRequiresUppercase: boolean, passwordRequiresNumbers: boolean, passwordRequiresSymbols: boolean, requiredAttributes: Array<string>, clientRefreshTokenValidity: number, usernameCaseSensitive: boolean, tableId: string, usernameFieldId: string, passwordFieldId: string };

export type CreateProjectMutationVariables = Exact<{
  project: ProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', _id: any, projectName: string, appId: string } };

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: any };

export type GetAuthQueryVariables = Exact<{
  projectId: Scalars['ObjectId'];
}>;


export type GetAuthQuery = { __typename?: 'Query', getAuth?: { __typename?: 'Auth', _id: any, requiresAuth: boolean, allowUnauthenticatedUsers: boolean, mfaEnabled: boolean, mfaConfiguration: string, mfaTypes: string, smsAuthenticationMessage: string, smsVerificationMessage: string, emailVerificationSubject: string, emailVerificationMessage: string, defaultPasswordPolicy: boolean, passwordPolicyMinLength: number, passwordRequiresUppercase: boolean, passwordRequiresNumbers: boolean, passwordRequiresSymbols: boolean, requiredAttributes: Array<string>, clientRefreshTokenValidity: number, usernameCaseSensitive: boolean, tableId: string, usernameFieldId: string, passwordFieldId: string } | null };

export type GetProjectQueryVariables = Exact<{
  projectId: Scalars['ObjectId'];
}>;


export type GetProjectQuery = { __typename?: 'Query', getProject: { __typename?: 'Project', _id: any, appId: string, projectName: string, appConfig: { __typename?: 'AppConfig', appEntryComponentId?: any | null, apiConfig: { __typename?: 'Api', sandboxEndpoint?: string | null, liveEndpoint?: string | null, queries: Array<string>, mutations: Array<string>, subscriptions: Array<string>, models: Array<{ __typename?: 'EntityModel', _id: any, name: string, keys: Array<{ __typename?: 'Key', name: string, fieldNames: Array<string> }>, auth: Array<{ __typename?: 'DataAuth', allow: string, provider: string, ownerField: string, identityClaim: string, groupClaim: string, groups: Array<string>, groupsField: string, operations: Array<string> }>, fields: Array<{ __typename?: 'DataField', _id: any, fieldName: string, isUnique: boolean, isHashed: boolean, isList?: boolean | null, nullable: boolean, dataType: string, connection?: boolean | null, rules: Array<{ __typename?: 'DataAuth', allow: string, provider: string, ownerField: string, identityClaim: string, groupClaim: string, groups: Array<string>, groupsField: string, operations: Array<string> }>, keys: Array<{ __typename?: 'Key', name: string, fieldNames: Array<string> }> }> }> }, authConfig: { __typename?: 'Auth', requiresAuth: boolean, allowUnauthenticatedUsers: boolean, mfaEnabled: boolean, mfaConfiguration: string, mfaTypes: string, smsAuthenticationMessage: string, smsVerificationMessage: string, emailVerificationSubject: string, emailVerificationMessage: string, defaultPasswordPolicy: boolean, passwordPolicyMinLength: number, passwordRequiresUppercase: boolean, passwordRequiresNumbers: boolean, passwordRequiresSymbols: boolean, requiredAttributes: Array<string>, clientRefreshTokenValidity: number, usernameCaseSensitive: boolean, tableId: string, usernameFieldId: string, passwordFieldId: string } } } };

export type GetServerStatusQueryVariables = Exact<{
  projectId: Scalars['ObjectId'];
  sandbox: Scalars['Boolean'];
}>;


export type GetServerStatusQuery = { __typename?: 'Query', getServerStatus: boolean };

export type ListProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListProjectsQuery = { __typename?: 'Query', listProjects: Array<{ __typename?: 'Project', _id: any, projectName: string, appId: string, organization: { __typename?: 'Organization', _id: any } }> };

export type PublishApiMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  sandbox: Scalars['Boolean'];
}>;


export type PublishApiMutation = { __typename?: 'Mutation', publishApi: boolean };

export type UpdateAppConfigMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  appConfig: AppConfigInput;
}>;


export type UpdateAppConfigMutation = { __typename?: 'Mutation', updateAppConfig: boolean };

export type UpdateAuthMutationVariables = Exact<{
  projectId: Scalars['ObjectId'];
  input: AuthInput;
}>;


export type UpdateAuthMutation = { __typename?: 'Mutation', updateAuth?: { __typename?: 'Auth', _id: any, requiresAuth: boolean, allowUnauthenticatedUsers: boolean, mfaEnabled: boolean, mfaConfiguration: string, mfaTypes: string, smsAuthenticationMessage: string, smsVerificationMessage: string, emailVerificationSubject: string, emailVerificationMessage: string, defaultPasswordPolicy: boolean, passwordPolicyMinLength: number, passwordRequiresUppercase: boolean, passwordRequiresNumbers: boolean, passwordRequiresSymbols: boolean, requiredAttributes: Array<string>, clientRefreshTokenValidity: number, usernameCaseSensitive: boolean, tableId: string, usernameFieldId: string, passwordFieldId: string } | null };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id: any, email: string, userRole: string, fullName?: string | null, username?: string | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', sessionId?: string | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: any, email: string, userRole: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', email: string, userRole: string } | null } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type UpdateMeMutationVariables = Exact<{
  userInput: UserInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'User', _id: any, email: string, userRole: string, fullName?: string | null, username?: string | null } };

export const ComponentFragmentFragmentDoc = gql`
    fragment ComponentFragment on Component {
  _id
  package
  type
  name
  x
  y
  isContainer
  isRootElement
  parameters {
    _id
    entityId
    name
  }
  fetched {
    type
    variables
  }
  props
  data
  parent {
    _id
  }
}
    `;
export const TypeRefFragmentDoc = gql`
    fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const InputValueFragmentDoc = gql`
    fragment InputValue on __InputValue {
  name
  type {
    ...TypeRef
  }
  defaultValue
}
    ${TypeRefFragmentDoc}`;
export const FullTypeFragmentDoc = gql`
    fragment FullType on __Type {
  kind
  name
  fields(includeDeprecated: true) {
    name
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}
    ${InputValueFragmentDoc}
${TypeRefFragmentDoc}`;
export const AuthFragmentFragmentDoc = gql`
    fragment AuthFragment on Auth {
  _id
  requiresAuth
  allowUnauthenticatedUsers
  mfaEnabled
  mfaConfiguration
  mfaTypes
  smsAuthenticationMessage
  smsVerificationMessage
  emailVerificationSubject
  emailVerificationMessage
  defaultPasswordPolicy
  passwordPolicyMinLength
  passwordRequiresUppercase
  passwordRequiresNumbers
  passwordRequiresSymbols
  requiredAttributes
  clientRefreshTokenValidity
  usernameCaseSensitive
  tableId
  usernameFieldId
  passwordFieldId
}
    `;
export const AddParameterDocument = gql`
    mutation AddParameter($componentId: ObjectId!, $parameterInput: RequiredParameterInput!) {
  addParameter(componentId: $componentId, parameterInput: $parameterInput)
}
    `;
export type AddParameterMutationFn = Apollo.MutationFunction<AddParameterMutation, AddParameterMutationVariables>;

/**
 * __useAddParameterMutation__
 *
 * To run a mutation, you first call `useAddParameterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddParameterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addParameterMutation, { data, loading, error }] = useAddParameterMutation({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      parameterInput: // value for 'parameterInput'
 *   },
 * });
 */
export function useAddParameterMutation(baseOptions?: Apollo.MutationHookOptions<AddParameterMutation, AddParameterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddParameterMutation, AddParameterMutationVariables>(AddParameterDocument, options);
      }
export type AddParameterMutationHookResult = ReturnType<typeof useAddParameterMutation>;
export type AddParameterMutationResult = Apollo.MutationResult<AddParameterMutation>;
export type AddParameterMutationOptions = Apollo.BaseMutationOptions<AddParameterMutation, AddParameterMutationVariables>;
export const CreateComponentDocument = gql`
    mutation CreateComponent($projectId: ObjectId!, $componentInput: ComponentInput!) {
  createComponent(projectId: $projectId, componentInput: $componentInput) {
    ...ComponentFragment
    children {
      ...ComponentFragment
    }
  }
}
    ${ComponentFragmentFragmentDoc}`;
export type CreateComponentMutationFn = Apollo.MutationFunction<CreateComponentMutation, CreateComponentMutationVariables>;

/**
 * __useCreateComponentMutation__
 *
 * To run a mutation, you first call `useCreateComponentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateComponentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createComponentMutation, { data, loading, error }] = useCreateComponentMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      componentInput: // value for 'componentInput'
 *   },
 * });
 */
export function useCreateComponentMutation(baseOptions?: Apollo.MutationHookOptions<CreateComponentMutation, CreateComponentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateComponentMutation, CreateComponentMutationVariables>(CreateComponentDocument, options);
      }
export type CreateComponentMutationHookResult = ReturnType<typeof useCreateComponentMutation>;
export type CreateComponentMutationResult = Apollo.MutationResult<CreateComponentMutation>;
export type CreateComponentMutationOptions = Apollo.BaseMutationOptions<CreateComponentMutation, CreateComponentMutationVariables>;
export const DeleteComponentsDocument = gql`
    mutation DeleteComponents($projectId: ObjectId!, $componentIds: [ObjectId!]!) {
  deleteComponents(projectId: $projectId, componentIds: $componentIds)
}
    `;
export type DeleteComponentsMutationFn = Apollo.MutationFunction<DeleteComponentsMutation, DeleteComponentsMutationVariables>;

/**
 * __useDeleteComponentsMutation__
 *
 * To run a mutation, you first call `useDeleteComponentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteComponentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteComponentsMutation, { data, loading, error }] = useDeleteComponentsMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      componentIds: // value for 'componentIds'
 *   },
 * });
 */
export function useDeleteComponentsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteComponentsMutation, DeleteComponentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteComponentsMutation, DeleteComponentsMutationVariables>(DeleteComponentsDocument, options);
      }
export type DeleteComponentsMutationHookResult = ReturnType<typeof useDeleteComponentsMutation>;
export type DeleteComponentsMutationResult = Apollo.MutationResult<DeleteComponentsMutation>;
export type DeleteComponentsMutationOptions = Apollo.BaseMutationOptions<DeleteComponentsMutation, DeleteComponentsMutationVariables>;
export const DuplicateComponentDocument = gql`
    mutation DuplicateComponent($componentId: ObjectId!, $projectId: ObjectId!) {
  duplicateComponent(componentId: $componentId, projectId: $projectId)
}
    `;
export type DuplicateComponentMutationFn = Apollo.MutationFunction<DuplicateComponentMutation, DuplicateComponentMutationVariables>;

/**
 * __useDuplicateComponentMutation__
 *
 * To run a mutation, you first call `useDuplicateComponentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDuplicateComponentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [duplicateComponentMutation, { data, loading, error }] = useDuplicateComponentMutation({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDuplicateComponentMutation(baseOptions?: Apollo.MutationHookOptions<DuplicateComponentMutation, DuplicateComponentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DuplicateComponentMutation, DuplicateComponentMutationVariables>(DuplicateComponentDocument, options);
      }
export type DuplicateComponentMutationHookResult = ReturnType<typeof useDuplicateComponentMutation>;
export type DuplicateComponentMutationResult = Apollo.MutationResult<DuplicateComponentMutation>;
export type DuplicateComponentMutationOptions = Apollo.BaseMutationOptions<DuplicateComponentMutation, DuplicateComponentMutationVariables>;
export const GetBindingTreeDocument = gql`
    query GetBindingTree($componentId: ObjectId!, $projectId: ObjectId!) {
  getBindingTree(componentId: $componentId, projectId: $projectId) {
    menu {
      entity
      hasSubMenu
      label
      source
    }
    structure {
      _id
      fields {
        dataType
        hasSubMenu
        key
        name
      }
      name
    }
  }
}
    `;

/**
 * __useGetBindingTreeQuery__
 *
 * To run a query within a React component, call `useGetBindingTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBindingTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBindingTreeQuery({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetBindingTreeQuery(baseOptions: Apollo.QueryHookOptions<GetBindingTreeQuery, GetBindingTreeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBindingTreeQuery, GetBindingTreeQueryVariables>(GetBindingTreeDocument, options);
      }
export function useGetBindingTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBindingTreeQuery, GetBindingTreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBindingTreeQuery, GetBindingTreeQueryVariables>(GetBindingTreeDocument, options);
        }
export type GetBindingTreeQueryHookResult = ReturnType<typeof useGetBindingTreeQuery>;
export type GetBindingTreeLazyQueryHookResult = ReturnType<typeof useGetBindingTreeLazyQuery>;
export type GetBindingTreeQueryResult = Apollo.QueryResult<GetBindingTreeQuery, GetBindingTreeQueryVariables>;
export const GetComponentDocument = gql`
    query GetComponent($componentId: ObjectId!) {
  getComponent(componentId: $componentId) {
    ...ComponentFragment
    children {
      ...ComponentFragment
      children {
        ...ComponentFragment
        children {
          ...ComponentFragment
          children {
            ...ComponentFragment
            children {
              ...ComponentFragment
              children {
                ...ComponentFragment
                children {
                  ...ComponentFragment
                  children {
                    ...ComponentFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    ${ComponentFragmentFragmentDoc}`;

/**
 * __useGetComponentQuery__
 *
 * To run a query within a React component, call `useGetComponentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetComponentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetComponentQuery({
 *   variables: {
 *      componentId: // value for 'componentId'
 *   },
 * });
 */
export function useGetComponentQuery(baseOptions: Apollo.QueryHookOptions<GetComponentQuery, GetComponentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetComponentQuery, GetComponentQueryVariables>(GetComponentDocument, options);
      }
export function useGetComponentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetComponentQuery, GetComponentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetComponentQuery, GetComponentQueryVariables>(GetComponentDocument, options);
        }
export type GetComponentQueryHookResult = ReturnType<typeof useGetComponentQuery>;
export type GetComponentLazyQueryHookResult = ReturnType<typeof useGetComponentLazyQuery>;
export type GetComponentQueryResult = Apollo.QueryResult<GetComponentQuery, GetComponentQueryVariables>;
export const GetDataContextDocument = gql`
    query GetDataContext($componentId: ObjectId!) {
  getDataContext(componentId: $componentId) {
    componentId
    name
    dataSources
  }
}
    `;

/**
 * __useGetDataContextQuery__
 *
 * To run a query within a React component, call `useGetDataContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataContextQuery({
 *   variables: {
 *      componentId: // value for 'componentId'
 *   },
 * });
 */
export function useGetDataContextQuery(baseOptions: Apollo.QueryHookOptions<GetDataContextQuery, GetDataContextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataContextQuery, GetDataContextQueryVariables>(GetDataContextDocument, options);
      }
export function useGetDataContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataContextQuery, GetDataContextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataContextQuery, GetDataContextQueryVariables>(GetDataContextDocument, options);
        }
export type GetDataContextQueryHookResult = ReturnType<typeof useGetDataContextQuery>;
export type GetDataContextLazyQueryHookResult = ReturnType<typeof useGetDataContextLazyQuery>;
export type GetDataContextQueryResult = Apollo.QueryResult<GetDataContextQuery, GetDataContextQueryVariables>;
export const GetComponentsDocument = gql`
    query GetComponents($projectId: ObjectId!) {
  getComponents(projectId: $projectId) {
    ...ComponentFragment
    children {
      ...ComponentFragment
      children {
        ...ComponentFragment
        children {
          ...ComponentFragment
          children {
            ...ComponentFragment
            children {
              ...ComponentFragment
              children {
                ...ComponentFragment
                children {
                  ...ComponentFragment
                  children {
                    ...ComponentFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    ${ComponentFragmentFragmentDoc}`;

/**
 * __useGetComponentsQuery__
 *
 * To run a query within a React component, call `useGetComponentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetComponentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetComponentsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetComponentsQuery(baseOptions: Apollo.QueryHookOptions<GetComponentsQuery, GetComponentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetComponentsQuery, GetComponentsQueryVariables>(GetComponentsDocument, options);
      }
export function useGetComponentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetComponentsQuery, GetComponentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetComponentsQuery, GetComponentsQueryVariables>(GetComponentsDocument, options);
        }
export type GetComponentsQueryHookResult = ReturnType<typeof useGetComponentsQuery>;
export type GetComponentsLazyQueryHookResult = ReturnType<typeof useGetComponentsLazyQuery>;
export type GetComponentsQueryResult = Apollo.QueryResult<GetComponentsQuery, GetComponentsQueryVariables>;
export const GetEntityModelDocument = gql`
    query GetEntityModel($projectId: ObjectId!, $entityModelId: ObjectId!) {
  getEntityModel(projectId: $projectId, entityModelId: $entityModelId) {
    _id
    name
    fields {
      _id
      fieldName
      isUnique
      isHashed
      isList
      connection
      nullable
      dataType
    }
  }
}
    `;

/**
 * __useGetEntityModelQuery__
 *
 * To run a query within a React component, call `useGetEntityModelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntityModelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntityModelQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      entityModelId: // value for 'entityModelId'
 *   },
 * });
 */
export function useGetEntityModelQuery(baseOptions: Apollo.QueryHookOptions<GetEntityModelQuery, GetEntityModelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEntityModelQuery, GetEntityModelQueryVariables>(GetEntityModelDocument, options);
      }
export function useGetEntityModelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEntityModelQuery, GetEntityModelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEntityModelQuery, GetEntityModelQueryVariables>(GetEntityModelDocument, options);
        }
export type GetEntityModelQueryHookResult = ReturnType<typeof useGetEntityModelQuery>;
export type GetEntityModelLazyQueryHookResult = ReturnType<typeof useGetEntityModelLazyQuery>;
export type GetEntityModelQueryResult = Apollo.QueryResult<GetEntityModelQuery, GetEntityModelQueryVariables>;
export const RemoveParameterDocument = gql`
    mutation RemoveParameter($componentId: ObjectId!, $parameterId: ObjectId!) {
  removeParameter(componentId: $componentId, parameterId: $parameterId)
}
    `;
export type RemoveParameterMutationFn = Apollo.MutationFunction<RemoveParameterMutation, RemoveParameterMutationVariables>;

/**
 * __useRemoveParameterMutation__
 *
 * To run a mutation, you first call `useRemoveParameterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveParameterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeParameterMutation, { data, loading, error }] = useRemoveParameterMutation({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      parameterId: // value for 'parameterId'
 *   },
 * });
 */
export function useRemoveParameterMutation(baseOptions?: Apollo.MutationHookOptions<RemoveParameterMutation, RemoveParameterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveParameterMutation, RemoveParameterMutationVariables>(RemoveParameterDocument, options);
      }
export type RemoveParameterMutationHookResult = ReturnType<typeof useRemoveParameterMutation>;
export type RemoveParameterMutationResult = Apollo.MutationResult<RemoveParameterMutation>;
export type RemoveParameterMutationOptions = Apollo.BaseMutationOptions<RemoveParameterMutation, RemoveParameterMutationVariables>;
export const UpdateComponentDocument = gql`
    mutation UpdateComponent($componentId: ObjectId!, $componentInput: ComponentInput!) {
  updateComponent(componentId: $componentId, componentInput: $componentInput) {
    ...ComponentFragment
  }
}
    ${ComponentFragmentFragmentDoc}`;
export type UpdateComponentMutationFn = Apollo.MutationFunction<UpdateComponentMutation, UpdateComponentMutationVariables>;

/**
 * __useUpdateComponentMutation__
 *
 * To run a mutation, you first call `useUpdateComponentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateComponentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateComponentMutation, { data, loading, error }] = useUpdateComponentMutation({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      componentInput: // value for 'componentInput'
 *   },
 * });
 */
export function useUpdateComponentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateComponentMutation, UpdateComponentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateComponentMutation, UpdateComponentMutationVariables>(UpdateComponentDocument, options);
      }
export type UpdateComponentMutationHookResult = ReturnType<typeof useUpdateComponentMutation>;
export type UpdateComponentMutationResult = Apollo.MutationResult<UpdateComponentMutation>;
export type UpdateComponentMutationOptions = Apollo.BaseMutationOptions<UpdateComponentMutation, UpdateComponentMutationVariables>;
export const UpdateComponentPropsDocument = gql`
    mutation UpdateComponentProps($componentId: ObjectId!, $props: JSONObject!) {
  updateComponentProps(componentId: $componentId, props: $props) {
    ...ComponentFragment
  }
}
    ${ComponentFragmentFragmentDoc}`;
export type UpdateComponentPropsMutationFn = Apollo.MutationFunction<UpdateComponentPropsMutation, UpdateComponentPropsMutationVariables>;

/**
 * __useUpdateComponentPropsMutation__
 *
 * To run a mutation, you first call `useUpdateComponentPropsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateComponentPropsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateComponentPropsMutation, { data, loading, error }] = useUpdateComponentPropsMutation({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      props: // value for 'props'
 *   },
 * });
 */
export function useUpdateComponentPropsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateComponentPropsMutation, UpdateComponentPropsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateComponentPropsMutation, UpdateComponentPropsMutationVariables>(UpdateComponentPropsDocument, options);
      }
export type UpdateComponentPropsMutationHookResult = ReturnType<typeof useUpdateComponentPropsMutation>;
export type UpdateComponentPropsMutationResult = Apollo.MutationResult<UpdateComponentPropsMutation>;
export type UpdateComponentPropsMutationOptions = Apollo.BaseMutationOptions<UpdateComponentPropsMutation, UpdateComponentPropsMutationVariables>;
export const UpdateParameterDocument = gql`
    mutation UpdateParameter($componentId: ObjectId!, $parameterId: ObjectId!, $parameterInput: RequiredParameterInput!) {
  updateParameter(
    componentId: $componentId
    parameterId: $parameterId
    parameterInput: $parameterInput
  )
}
    `;
export type UpdateParameterMutationFn = Apollo.MutationFunction<UpdateParameterMutation, UpdateParameterMutationVariables>;

/**
 * __useUpdateParameterMutation__
 *
 * To run a mutation, you first call `useUpdateParameterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParameterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParameterMutation, { data, loading, error }] = useUpdateParameterMutation({
 *   variables: {
 *      componentId: // value for 'componentId'
 *      parameterId: // value for 'parameterId'
 *      parameterInput: // value for 'parameterInput'
 *   },
 * });
 */
export function useUpdateParameterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateParameterMutation, UpdateParameterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateParameterMutation, UpdateParameterMutationVariables>(UpdateParameterDocument, options);
      }
export type UpdateParameterMutationHookResult = ReturnType<typeof useUpdateParameterMutation>;
export type UpdateParameterMutationResult = Apollo.MutationResult<UpdateParameterMutation>;
export type UpdateParameterMutationOptions = Apollo.BaseMutationOptions<UpdateParameterMutation, UpdateParameterMutationVariables>;
export const CreateDataFieldDocument = gql`
    mutation CreateDataField($projectId: ObjectId!, $entityModelId: ObjectId!, $dataField: DataFieldInput!) {
  createDataField(
    projectId: $projectId
    entityModelId: $entityModelId
    dataField: $dataField
  ) {
    _id
    fieldName
    isUnique
    isHashed
    isList
    nullable
    connection
    dataType
    rules {
      allow
      provider
      ownerField
      identityClaim
      groupClaim
      groups
      groupsField
      operations
    }
    keys {
      name
      fieldNames
    }
  }
}
    `;
export type CreateDataFieldMutationFn = Apollo.MutationFunction<CreateDataFieldMutation, CreateDataFieldMutationVariables>;

/**
 * __useCreateDataFieldMutation__
 *
 * To run a mutation, you first call `useCreateDataFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDataFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDataFieldMutation, { data, loading, error }] = useCreateDataFieldMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      entityModelId: // value for 'entityModelId'
 *      dataField: // value for 'dataField'
 *   },
 * });
 */
export function useCreateDataFieldMutation(baseOptions?: Apollo.MutationHookOptions<CreateDataFieldMutation, CreateDataFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDataFieldMutation, CreateDataFieldMutationVariables>(CreateDataFieldDocument, options);
      }
export type CreateDataFieldMutationHookResult = ReturnType<typeof useCreateDataFieldMutation>;
export type CreateDataFieldMutationResult = Apollo.MutationResult<CreateDataFieldMutation>;
export type CreateDataFieldMutationOptions = Apollo.BaseMutationOptions<CreateDataFieldMutation, CreateDataFieldMutationVariables>;
export const DeleteDataFieldDocument = gql`
    mutation DeleteDataField($projectId: ObjectId!, $entityModelId: ObjectId!, $dataFieldId: ObjectId!) {
  deleteDataField(
    projectId: $projectId
    entityModelId: $entityModelId
    dataFieldId: $dataFieldId
  )
}
    `;
export type DeleteDataFieldMutationFn = Apollo.MutationFunction<DeleteDataFieldMutation, DeleteDataFieldMutationVariables>;

/**
 * __useDeleteDataFieldMutation__
 *
 * To run a mutation, you first call `useDeleteDataFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDataFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDataFieldMutation, { data, loading, error }] = useDeleteDataFieldMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      entityModelId: // value for 'entityModelId'
 *      dataFieldId: // value for 'dataFieldId'
 *   },
 * });
 */
export function useDeleteDataFieldMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDataFieldMutation, DeleteDataFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDataFieldMutation, DeleteDataFieldMutationVariables>(DeleteDataFieldDocument, options);
      }
export type DeleteDataFieldMutationHookResult = ReturnType<typeof useDeleteDataFieldMutation>;
export type DeleteDataFieldMutationResult = Apollo.MutationResult<DeleteDataFieldMutation>;
export type DeleteDataFieldMutationOptions = Apollo.BaseMutationOptions<DeleteDataFieldMutation, DeleteDataFieldMutationVariables>;
export const CreateEntityModelDocument = gql`
    mutation CreateEntityModel($projectId: ObjectId!, $name: String!) {
  createEntityModel(projectId: $projectId, name: $name) {
    _id
    name
  }
}
    `;
export type CreateEntityModelMutationFn = Apollo.MutationFunction<CreateEntityModelMutation, CreateEntityModelMutationVariables>;

/**
 * __useCreateEntityModelMutation__
 *
 * To run a mutation, you first call `useCreateEntityModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityModelMutation, { data, loading, error }] = useCreateEntityModelMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateEntityModelMutation(baseOptions?: Apollo.MutationHookOptions<CreateEntityModelMutation, CreateEntityModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEntityModelMutation, CreateEntityModelMutationVariables>(CreateEntityModelDocument, options);
      }
export type CreateEntityModelMutationHookResult = ReturnType<typeof useCreateEntityModelMutation>;
export type CreateEntityModelMutationResult = Apollo.MutationResult<CreateEntityModelMutation>;
export type CreateEntityModelMutationOptions = Apollo.BaseMutationOptions<CreateEntityModelMutation, CreateEntityModelMutationVariables>;
export const DeleteEntityModelDocument = gql`
    mutation DeleteEntityModel($projectId: ObjectId!, $entityModelId: ObjectId!) {
  deleteEntityModel(projectId: $projectId, entityModelId: $entityModelId)
}
    `;
export type DeleteEntityModelMutationFn = Apollo.MutationFunction<DeleteEntityModelMutation, DeleteEntityModelMutationVariables>;

/**
 * __useDeleteEntityModelMutation__
 *
 * To run a mutation, you first call `useDeleteEntityModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEntityModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEntityModelMutation, { data, loading, error }] = useDeleteEntityModelMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      entityModelId: // value for 'entityModelId'
 *   },
 * });
 */
export function useDeleteEntityModelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEntityModelMutation, DeleteEntityModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEntityModelMutation, DeleteEntityModelMutationVariables>(DeleteEntityModelDocument, options);
      }
export type DeleteEntityModelMutationHookResult = ReturnType<typeof useDeleteEntityModelMutation>;
export type DeleteEntityModelMutationResult = Apollo.MutationResult<DeleteEntityModelMutation>;
export type DeleteEntityModelMutationOptions = Apollo.BaseMutationOptions<DeleteEntityModelMutation, DeleteEntityModelMutationVariables>;
export const IntrospectionQueryDocument = gql`
    query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      locations
      args {
        ...InputValue
      }
    }
  }
}
    ${FullTypeFragmentDoc}
${InputValueFragmentDoc}`;

/**
 * __useIntrospectionQueryQuery__
 *
 * To run a query within a React component, call `useIntrospectionQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useIntrospectionQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIntrospectionQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useIntrospectionQueryQuery(baseOptions?: Apollo.QueryHookOptions<IntrospectionQueryQuery, IntrospectionQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IntrospectionQueryQuery, IntrospectionQueryQueryVariables>(IntrospectionQueryDocument, options);
      }
export function useIntrospectionQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IntrospectionQueryQuery, IntrospectionQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IntrospectionQueryQuery, IntrospectionQueryQueryVariables>(IntrospectionQueryDocument, options);
        }
export type IntrospectionQueryQueryHookResult = ReturnType<typeof useIntrospectionQueryQuery>;
export type IntrospectionQueryLazyQueryHookResult = ReturnType<typeof useIntrospectionQueryLazyQuery>;
export type IntrospectionQueryQueryResult = Apollo.QueryResult<IntrospectionQueryQuery, IntrospectionQueryQueryVariables>;
export const CreateLabelTagDocument = gql`
    mutation CreateLabelTag($projectId: ObjectId!, $tagName: String!, $numberOfStates: Int!) {
  createLabelTag(
    projectId: $projectId
    tagName: $tagName
    numberOfStates: $numberOfStates
  ) {
    _id
  }
}
    `;
export type CreateLabelTagMutationFn = Apollo.MutationFunction<CreateLabelTagMutation, CreateLabelTagMutationVariables>;

/**
 * __useCreateLabelTagMutation__
 *
 * To run a mutation, you first call `useCreateLabelTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLabelTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLabelTagMutation, { data, loading, error }] = useCreateLabelTagMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      tagName: // value for 'tagName'
 *      numberOfStates: // value for 'numberOfStates'
 *   },
 * });
 */
export function useCreateLabelTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateLabelTagMutation, CreateLabelTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLabelTagMutation, CreateLabelTagMutationVariables>(CreateLabelTagDocument, options);
      }
export type CreateLabelTagMutationHookResult = ReturnType<typeof useCreateLabelTagMutation>;
export type CreateLabelTagMutationResult = Apollo.MutationResult<CreateLabelTagMutation>;
export type CreateLabelTagMutationOptions = Apollo.BaseMutationOptions<CreateLabelTagMutation, CreateLabelTagMutationVariables>;
export const CreateLangaugeDocument = gql`
    mutation CreateLangauge($projectId: ObjectId!, $languageName: String!, $languageCode: String!) {
  createLanguage(
    projectId: $projectId
    languageName: $languageName
    languageCode: $languageCode
  ) {
    _id
  }
}
    `;
export type CreateLangaugeMutationFn = Apollo.MutationFunction<CreateLangaugeMutation, CreateLangaugeMutationVariables>;

/**
 * __useCreateLangaugeMutation__
 *
 * To run a mutation, you first call `useCreateLangaugeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLangaugeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLangaugeMutation, { data, loading, error }] = useCreateLangaugeMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      languageName: // value for 'languageName'
 *      languageCode: // value for 'languageCode'
 *   },
 * });
 */
export function useCreateLangaugeMutation(baseOptions?: Apollo.MutationHookOptions<CreateLangaugeMutation, CreateLangaugeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLangaugeMutation, CreateLangaugeMutationVariables>(CreateLangaugeDocument, options);
      }
export type CreateLangaugeMutationHookResult = ReturnType<typeof useCreateLangaugeMutation>;
export type CreateLangaugeMutationResult = Apollo.MutationResult<CreateLangaugeMutation>;
export type CreateLangaugeMutationOptions = Apollo.BaseMutationOptions<CreateLangaugeMutation, CreateLangaugeMutationVariables>;
export const CreateTranslationDocument = gql`
    mutation CreateTranslation($projectId: ObjectId!, $languageId: ObjectId!, $tagId: ObjectId!, $translations: [String!]!) {
  createTranslation(
    projectId: $projectId
    languageId: $languageId
    tagId: $tagId
    translations: $translations
  ) {
    _id
  }
}
    `;
export type CreateTranslationMutationFn = Apollo.MutationFunction<CreateTranslationMutation, CreateTranslationMutationVariables>;

/**
 * __useCreateTranslationMutation__
 *
 * To run a mutation, you first call `useCreateTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTranslationMutation, { data, loading, error }] = useCreateTranslationMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      languageId: // value for 'languageId'
 *      tagId: // value for 'tagId'
 *      translations: // value for 'translations'
 *   },
 * });
 */
export function useCreateTranslationMutation(baseOptions?: Apollo.MutationHookOptions<CreateTranslationMutation, CreateTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTranslationMutation, CreateTranslationMutationVariables>(CreateTranslationDocument, options);
      }
export type CreateTranslationMutationHookResult = ReturnType<typeof useCreateTranslationMutation>;
export type CreateTranslationMutationResult = Apollo.MutationResult<CreateTranslationMutation>;
export type CreateTranslationMutationOptions = Apollo.BaseMutationOptions<CreateTranslationMutation, CreateTranslationMutationVariables>;
export const GetLabelLibraryDocument = gql`
    query GetLabelLibrary($projectId: ObjectId!) {
  getLabelLibrary(projectId: $projectId) {
    languages {
      _id
      name
      code
    }
    translations {
      language
      translations {
        tag
        value
      }
    }
    labelTags {
      _id
      name
      numberOfStates
    }
  }
}
    `;

/**
 * __useGetLabelLibraryQuery__
 *
 * To run a query within a React component, call `useGetLabelLibraryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLabelLibraryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLabelLibraryQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetLabelLibraryQuery(baseOptions: Apollo.QueryHookOptions<GetLabelLibraryQuery, GetLabelLibraryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLabelLibraryQuery, GetLabelLibraryQueryVariables>(GetLabelLibraryDocument, options);
      }
export function useGetLabelLibraryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLabelLibraryQuery, GetLabelLibraryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLabelLibraryQuery, GetLabelLibraryQueryVariables>(GetLabelLibraryDocument, options);
        }
export type GetLabelLibraryQueryHookResult = ReturnType<typeof useGetLabelLibraryQuery>;
export type GetLabelLibraryLazyQueryHookResult = ReturnType<typeof useGetLabelLibraryLazyQuery>;
export type GetLabelLibraryQueryResult = Apollo.QueryResult<GetLabelLibraryQuery, GetLabelLibraryQueryVariables>;
export const UpdateTranslationDocument = gql`
    mutation UpdateTranslation($projectId: ObjectId!, $languageId: ObjectId!, $tagId: ObjectId!, $translations: [String!]!) {
  updateTranslation(
    projectId: $projectId
    languageId: $languageId
    tagId: $tagId
    translations: $translations
  ) {
    _id
  }
}
    `;
export type UpdateTranslationMutationFn = Apollo.MutationFunction<UpdateTranslationMutation, UpdateTranslationMutationVariables>;

/**
 * __useUpdateTranslationMutation__
 *
 * To run a mutation, you first call `useUpdateTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTranslationMutation, { data, loading, error }] = useUpdateTranslationMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      languageId: // value for 'languageId'
 *      tagId: // value for 'tagId'
 *      translations: // value for 'translations'
 *   },
 * });
 */
export function useUpdateTranslationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTranslationMutation, UpdateTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTranslationMutation, UpdateTranslationMutationVariables>(UpdateTranslationDocument, options);
      }
export type UpdateTranslationMutationHookResult = ReturnType<typeof useUpdateTranslationMutation>;
export type UpdateTranslationMutationResult = Apollo.MutationResult<UpdateTranslationMutation>;
export type UpdateTranslationMutationOptions = Apollo.BaseMutationOptions<UpdateTranslationMutation, UpdateTranslationMutationVariables>;
export const CreateOrganizationDocument = gql`
    mutation CreateOrganization($organization: OrganizationInput!) {
  createOrganization(organization: $organization) {
    _id
    name
    owner {
      _id
    }
    members {
      _id
      email
    }
  }
}
    `;
export type CreateOrganizationMutationFn = Apollo.MutationFunction<CreateOrganizationMutation, CreateOrganizationMutationVariables>;

/**
 * __useCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationMutation, { data, loading, error }] = useCreateOrganizationMutation({
 *   variables: {
 *      organization: // value for 'organization'
 *   },
 * });
 */
export function useCreateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationMutation, CreateOrganizationMutationVariables>(CreateOrganizationDocument, options);
      }
export type CreateOrganizationMutationHookResult = ReturnType<typeof useCreateOrganizationMutation>;
export type CreateOrganizationMutationResult = Apollo.MutationResult<CreateOrganizationMutation>;
export type CreateOrganizationMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const DeleteOrganizationDocument = gql`
    mutation DeleteOrganization($organizationId: ObjectId!) {
  deleteOrganization(organizationId: $organizationId)
}
    `;
export type DeleteOrganizationMutationFn = Apollo.MutationFunction<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;

/**
 * __useDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationMutation, { data, loading, error }] = useDeleteOrganizationMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useDeleteOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>(DeleteOrganizationDocument, options);
      }
export type DeleteOrganizationMutationHookResult = ReturnType<typeof useDeleteOrganizationMutation>;
export type DeleteOrganizationMutationResult = Apollo.MutationResult<DeleteOrganizationMutation>;
export type DeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
export const ListOrganizationsDocument = gql`
    query ListOrganizations {
  listOrganizations {
    _id
    name
    owner {
      _id
    }
    members {
      _id
      email
    }
  }
}
    `;

/**
 * __useListOrganizationsQuery__
 *
 * To run a query within a React component, call `useListOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<ListOrganizationsQuery, ListOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListOrganizationsQuery, ListOrganizationsQueryVariables>(ListOrganizationsDocument, options);
      }
export function useListOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListOrganizationsQuery, ListOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListOrganizationsQuery, ListOrganizationsQueryVariables>(ListOrganizationsDocument, options);
        }
export type ListOrganizationsQueryHookResult = ReturnType<typeof useListOrganizationsQuery>;
export type ListOrganizationsLazyQueryHookResult = ReturnType<typeof useListOrganizationsLazyQuery>;
export type ListOrganizationsQueryResult = Apollo.QueryResult<ListOrganizationsQuery, ListOrganizationsQueryVariables>;
export const GetPackagesDocument = gql`
    query GetPackages {
  getPackages {
    _id
    packageName
    repositoryUrl
    version
    bundle
    components {
      _id
      name
      schema
      defaultValue
      icon
      isRootElement
      isContainer
    }
    authorId
    scope
  }
}
    `;

/**
 * __useGetPackagesQuery__
 *
 * To run a query within a React component, call `useGetPackagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPackagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPackagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPackagesQuery(baseOptions?: Apollo.QueryHookOptions<GetPackagesQuery, GetPackagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPackagesQuery, GetPackagesQueryVariables>(GetPackagesDocument, options);
      }
export function useGetPackagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPackagesQuery, GetPackagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPackagesQuery, GetPackagesQueryVariables>(GetPackagesDocument, options);
        }
export type GetPackagesQueryHookResult = ReturnType<typeof useGetPackagesQuery>;
export type GetPackagesLazyQueryHookResult = ReturnType<typeof useGetPackagesLazyQuery>;
export type GetPackagesQueryResult = Apollo.QueryResult<GetPackagesQuery, GetPackagesQueryVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($project: ProjectInput!) {
  createProject(project: $project) {
    _id
    projectName
    appId
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($projectId: ObjectId!) {
  deleteProject(projectId: $projectId)
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const GetAuthDocument = gql`
    query GetAuth($projectId: ObjectId!) {
  getAuth(projectId: $projectId) {
    ...AuthFragment
  }
}
    ${AuthFragmentFragmentDoc}`;

/**
 * __useGetAuthQuery__
 *
 * To run a query within a React component, call `useGetAuthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetAuthQuery(baseOptions: Apollo.QueryHookOptions<GetAuthQuery, GetAuthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthQuery, GetAuthQueryVariables>(GetAuthDocument, options);
      }
export function useGetAuthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthQuery, GetAuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthQuery, GetAuthQueryVariables>(GetAuthDocument, options);
        }
export type GetAuthQueryHookResult = ReturnType<typeof useGetAuthQuery>;
export type GetAuthLazyQueryHookResult = ReturnType<typeof useGetAuthLazyQuery>;
export type GetAuthQueryResult = Apollo.QueryResult<GetAuthQuery, GetAuthQueryVariables>;
export const GetProjectDocument = gql`
    query GetProject($projectId: ObjectId!) {
  getProject(projectId: $projectId) {
    _id
    appId
    projectName
    appConfig {
      appEntryComponentId
      apiConfig {
        sandboxEndpoint
        liveEndpoint
        models {
          _id
          name
          keys {
            name
            fieldNames
          }
          auth {
            allow
            provider
            ownerField
            identityClaim
            groupClaim
            groups
            groupsField
            operations
          }
          fields {
            _id
            fieldName
            isUnique
            isHashed
            isList
            nullable
            dataType
            connection
            rules {
              allow
              provider
              ownerField
              identityClaim
              groupClaim
              groups
              groupsField
              operations
            }
            keys {
              name
              fieldNames
            }
          }
        }
        queries
        mutations
        subscriptions
      }
      authConfig {
        requiresAuth
        allowUnauthenticatedUsers
        mfaEnabled
        mfaConfiguration
        mfaTypes
        smsAuthenticationMessage
        smsVerificationMessage
        emailVerificationSubject
        emailVerificationMessage
        defaultPasswordPolicy
        passwordPolicyMinLength
        passwordRequiresUppercase
        passwordRequiresNumbers
        passwordRequiresSymbols
        requiredAttributes
        clientRefreshTokenValidity
        usernameCaseSensitive
        tableId
        usernameFieldId
        passwordFieldId
      }
    }
  }
}
    `;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetServerStatusDocument = gql`
    query GetServerStatus($projectId: ObjectId!, $sandbox: Boolean!) {
  getServerStatus(projectId: $projectId, sandbox: $sandbox)
}
    `;

/**
 * __useGetServerStatusQuery__
 *
 * To run a query within a React component, call `useGetServerStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerStatusQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      sandbox: // value for 'sandbox'
 *   },
 * });
 */
export function useGetServerStatusQuery(baseOptions: Apollo.QueryHookOptions<GetServerStatusQuery, GetServerStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServerStatusQuery, GetServerStatusQueryVariables>(GetServerStatusDocument, options);
      }
export function useGetServerStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServerStatusQuery, GetServerStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServerStatusQuery, GetServerStatusQueryVariables>(GetServerStatusDocument, options);
        }
export type GetServerStatusQueryHookResult = ReturnType<typeof useGetServerStatusQuery>;
export type GetServerStatusLazyQueryHookResult = ReturnType<typeof useGetServerStatusLazyQuery>;
export type GetServerStatusQueryResult = Apollo.QueryResult<GetServerStatusQuery, GetServerStatusQueryVariables>;
export const ListProjectsDocument = gql`
    query ListProjects {
  listProjects {
    _id
    projectName
    appId
    organization {
      _id
    }
  }
}
    `;

/**
 * __useListProjectsQuery__
 *
 * To run a query within a React component, call `useListProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListProjectsQuery(baseOptions?: Apollo.QueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListProjectsQuery, ListProjectsQueryVariables>(ListProjectsDocument, options);
      }
export function useListProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListProjectsQuery, ListProjectsQueryVariables>(ListProjectsDocument, options);
        }
export type ListProjectsQueryHookResult = ReturnType<typeof useListProjectsQuery>;
export type ListProjectsLazyQueryHookResult = ReturnType<typeof useListProjectsLazyQuery>;
export type ListProjectsQueryResult = Apollo.QueryResult<ListProjectsQuery, ListProjectsQueryVariables>;
export const PublishApiDocument = gql`
    mutation PublishApi($projectId: ObjectId!, $sandbox: Boolean!) {
  publishApi(projectId: $projectId, sandbox: $sandbox)
}
    `;
export type PublishApiMutationFn = Apollo.MutationFunction<PublishApiMutation, PublishApiMutationVariables>;

/**
 * __usePublishApiMutation__
 *
 * To run a mutation, you first call `usePublishApiMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishApiMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishApiMutation, { data, loading, error }] = usePublishApiMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      sandbox: // value for 'sandbox'
 *   },
 * });
 */
export function usePublishApiMutation(baseOptions?: Apollo.MutationHookOptions<PublishApiMutation, PublishApiMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishApiMutation, PublishApiMutationVariables>(PublishApiDocument, options);
      }
export type PublishApiMutationHookResult = ReturnType<typeof usePublishApiMutation>;
export type PublishApiMutationResult = Apollo.MutationResult<PublishApiMutation>;
export type PublishApiMutationOptions = Apollo.BaseMutationOptions<PublishApiMutation, PublishApiMutationVariables>;
export const UpdateAppConfigDocument = gql`
    mutation UpdateAppConfig($projectId: ObjectId!, $appConfig: AppConfigInput!) {
  updateAppConfig(projectId: $projectId, appConfig: $appConfig)
}
    `;
export type UpdateAppConfigMutationFn = Apollo.MutationFunction<UpdateAppConfigMutation, UpdateAppConfigMutationVariables>;

/**
 * __useUpdateAppConfigMutation__
 *
 * To run a mutation, you first call `useUpdateAppConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppConfigMutation, { data, loading, error }] = useUpdateAppConfigMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      appConfig: // value for 'appConfig'
 *   },
 * });
 */
export function useUpdateAppConfigMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAppConfigMutation, UpdateAppConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAppConfigMutation, UpdateAppConfigMutationVariables>(UpdateAppConfigDocument, options);
      }
export type UpdateAppConfigMutationHookResult = ReturnType<typeof useUpdateAppConfigMutation>;
export type UpdateAppConfigMutationResult = Apollo.MutationResult<UpdateAppConfigMutation>;
export type UpdateAppConfigMutationOptions = Apollo.BaseMutationOptions<UpdateAppConfigMutation, UpdateAppConfigMutationVariables>;
export const UpdateAuthDocument = gql`
    mutation UpdateAuth($projectId: ObjectId!, $input: AuthInput!) {
  updateAuth(projectId: $projectId, input: $input) {
    ...AuthFragment
  }
}
    ${AuthFragmentFragmentDoc}`;
export type UpdateAuthMutationFn = Apollo.MutationFunction<UpdateAuthMutation, UpdateAuthMutationVariables>;

/**
 * __useUpdateAuthMutation__
 *
 * To run a mutation, you first call `useUpdateAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAuthMutation, { data, loading, error }] = useUpdateAuthMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAuthMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAuthMutation, UpdateAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAuthMutation, UpdateAuthMutationVariables>(UpdateAuthDocument, options);
      }
export type UpdateAuthMutationHookResult = ReturnType<typeof useUpdateAuthMutation>;
export type UpdateAuthMutationResult = Apollo.MutationResult<UpdateAuthMutation>;
export type UpdateAuthMutationOptions = Apollo.BaseMutationOptions<UpdateAuthMutation, UpdateAuthMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    _id
    email
    userRole
    fullName
    username
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      _id
      email
      userRole
    }
    sessionId
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      email
      userRole
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateMeDocument = gql`
    mutation UpdateMe($userInput: UserInput!) {
  updateMe(userInput: $userInput) {
    _id
    email
    userRole
    fullName
    username
  }
}
    `;
export type UpdateMeMutationFn = Apollo.MutationFunction<UpdateMeMutation, UpdateMeMutationVariables>;

/**
 * __useUpdateMeMutation__
 *
 * To run a mutation, you first call `useUpdateMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeMutation, { data, loading, error }] = useUpdateMeMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useUpdateMeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeMutation, UpdateMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument, options);
      }
export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>;
export type UpdateMeMutationResult = Apollo.MutationResult<UpdateMeMutation>;
export type UpdateMeMutationOptions = Apollo.BaseMutationOptions<UpdateMeMutation, UpdateMeMutationVariables>;