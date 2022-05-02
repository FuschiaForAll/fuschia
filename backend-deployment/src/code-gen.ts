import { MongoClient, ObjectId, Db } from 'mongodb'
import fs from 'fs-extra'
import path from 'path'
import {
  generateConditionalInput,
  generateConnections,
  generateCreateInput,
  generateDeleteInput,
  generateFilterInput,
  generateUpdateInput,
} from './utils'
import { Field, JsonInputFile, Model } from './types'

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

function checkTypeForSpecial(type: string) {
  switch (type) {
    case 'FileUpload':
    case 'GeoLocation':
      return true
  }
  return false
}

export interface Import {
  [packageName: string]: {
    [componentName: string]: {
      type: 'default' | 'single'
      rename?: string
    }
  }
}

export function convertImports(imports: Import) {
  return Object.keys(imports)
    .map(packageKey => {
      const mainBuilder = []
      const partsBuilder = []
      const defaultsBuilder = []
      const singlesBuilder = []
      const defaults = Object.keys(imports[packageKey])
        .filter(importKey => imports[packageKey][importKey].type === 'default')
        .join(', ')
      let rest = Object.keys(imports[packageKey])
        .filter(importKey => imports[packageKey][importKey].type !== 'default')
        .map(importKey => {
          if (imports[packageKey][importKey].rename) {
            return `${importKey} as ${imports[packageKey][importKey].rename}`
          }
          return importKey
        })
        .join(', ')
      if (defaults) {
        partsBuilder.push(defaults)
      }
      if (rest) {
        rest = `{ ${rest} }`
        partsBuilder.push(rest)
      }
      mainBuilder.push(`import`)
      mainBuilder.push(partsBuilder.join(', '))
      mainBuilder.push(`from '${packageKey}'`)
      return mainBuilder.join(' ')
    })
    .join('\n')
}

function generateIndexFile(
  payload: JsonInputFile,
  models: Model[],
  projectId: string
) {
  const importsBuilder: Import = {}
  importsBuilder['express-session'] = {
    session: { type: 'default' },
  }
  importsBuilder['connect-redis'] = {
    connectRedis: { type: 'default' },
  }
  importsBuilder['./utils/config'] = {
    REDIS_URL: { type: 'single' },
    MONGO_DB_URL: { type: 'single' },
    SESSION_SECRET: { type: 'single' },
    REDIS_PORT: { type: 'single' },
    PORT: { type: 'single' },
  }
  importsBuilder['ioredis'] = {
    Redis: { type: 'default' },
  }
  importsBuilder['mongoose'] = {
    connect: { type: 'single' },
  }
  importsBuilder['type-graphql'] = {
    buildSchema: { type: 'single' },
  }
  importsBuilder['path'] = {
    path: { type: 'default' },
  }
  importsBuilder['./utils/typegoose-middleware'] = {
    TypegooseMiddleware: { type: 'single' },
  }
  importsBuilder['./utils/object-id.scalar'] = {
    ObjectIdScalar: { type: 'single' },
  }
  importsBuilder['mongodb'] = {
    ObjectId: { type: 'single' },
  }
  importsBuilder['./utils/auth-checker'] = {
    authChecker: { type: 'single' },
  }
  importsBuilder['apollo-server-express'] = {
    ApolloServer: { type: 'single' },
  }
  importsBuilder['http'] = {
    http: { type: 'default' },
  }
  importsBuilder['express'] = {
    express: { type: 'default' },
  }
  importsBuilder['cors'] = {
    cors: { type: 'default' },
  }
  importsBuilder['uuid'] = {
    v4: { type: 'single', rename: 'uuid' },
  }
  importsBuilder['cookie-parser'] = {
    cookies: { type: 'default' },
  }
  importsBuilder['cookie-parser'] = {
    cookies: { type: 'default' },
  }
  importsBuilder['typedi'] = {
    Container: { type: 'single' },
  }
  importsBuilder['fs'] = {
    fs: { type: 'default' },
  }
  importsBuilder['graphql-redis-subscriptions'] = {
    RedisPubSub: { type: 'single' },
  }
  importsBuilder['graphql'] = {
    execute: { type: 'single' },
    subscribe: { type: 'single' },
  }
  importsBuilder['subscriptions-transport-ws'] = {
    SubscriptionServer: { type: 'single' },
  }
  importsBuilder['graphql-type-json'] = {
    GraphQLJSONObject: { type: 'single' },
  }
  importsBuilder['./utils/consts'] = {
    COOKIE_NAME: { type: 'single' },
  }
  importsBuilder['graphql-upload'] = {
    graphqlUploadExpress: { type: 'single' },
  }
  importsBuilder['./utils/s3-uploader'] = {
    S3Uploader: { type: 'single' },
  }
  if (payload.authConfig.requiresAuth) {
    importsBuilder['./Authentication/Authentication.resolver'] = {
      AuthenticationResolver: { type: 'single' },
    }
  }
  const classBuilder = ['\n']
  classBuilder.push(`(async () => {`)
  classBuilder.push(`
  const redisStore = connectRedis(session);
  const redis = new Redis(\`\${REDIS_URL}:\${REDIS_PORT}\`);
  `)
  classBuilder.push(`
  const mongoose = await connect(MONGO_DB_URL, { dbName: "${projectId.toString()}" });
  const options = {
    host: REDIS_URL,
    port: REDIS_PORT,
    retryStrategy: (times: number) => {
      return Math.min(times * 50, 2000);
    },
  };
  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });  
  `)
  classBuilder.push(`  const schema = await buildSchema({`)
  classBuilder.push(`    resolvers: [`)
  if (payload.authConfig.requiresAuth) {
    classBuilder.push(`      AuthenticationResolver,`)
  }
  models.forEach(m => {
    if (!importsBuilder[`./${m.name}/${m.name}.resolver`]) {
      importsBuilder[`./${m.name}/${m.name}.resolver`] = {}
    }
    importsBuilder[`./${m.name}/${m.name}.resolver`][`${m.name}Resolver`] = {
      type: 'single',
    }
    classBuilder.push(`      ${m.name}Resolver,`)
  })
  classBuilder.push(`    ],`)
  classBuilder.push(
    `    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),`
  )
  classBuilder.push(`    globalMiddlewares: [TypegooseMiddleware],`)
  classBuilder.push(`    scalarsMap: [`)
  classBuilder.push(`      { type: ObjectId, scalar: ObjectIdScalar },`)
  classBuilder.push(`      { type: Object, scalar: GraphQLJSONObject },`)
  classBuilder.push(`    ],`)
  classBuilder.push(`    validate: true,`)
  classBuilder.push(`    authChecker,`)
  classBuilder.push(`    container: Container,`)
  classBuilder.push(`    pubSub,`)
  classBuilder.push(`  });`)
  classBuilder.push(`  const app = express();`)
  classBuilder.push(`  app.set("trust proxy", 1);`)
  classBuilder.push(`
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
`)
  classBuilder.push(`  app.use(cookies());`)
  classBuilder.push(
    `  app.use(graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 10 }));`
  )
  classBuilder.push(`
  app.use(
    session({
      genid: (req) => uuid(),
      name: COOKIE_NAME,
      store: new redisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "none", // csrf
        secure: true,
        domain:
          process.env.NODE_ENV === "production" ? "fuschia.com" : undefined,
      },
      saveUninitialized: true,
      secret: SESSION_SECRET,
      resave: false,
    })
  );
  `)
  classBuilder.push(`
  app.get("/project-files/*", async (req, res) => {
    const fileKey = decodeURI(req.path.replace("/project-files/", ""));
    const uploader = Container.get(S3Uploader);
    uploader.getFile(fileKey, res);
  });
  `)
  classBuilder.push(`
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      return {
        getUser: () => req.user,
        logout: () => req.logout(),
        req,
        res,
        redis,
      };
    },
  });
  `)
  classBuilder.push(`  await apolloServer.start();`)
  classBuilder.push(`
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  `)
  classBuilder.push(`  const server = http.createServer({}, app);`)
  classBuilder.push(`
  server.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams: string) => {
          const userSession = await redis.get(\`sess:\${connectionParams}\`);
          console.log(userSession);
          if (userSession) {
            const payload = JSON.parse(userSession);
            console.log(payload);

            return { userId: payload.userId };
          }
          return null;
        },
      },
      {
        server,
        path: "/subscriptions",
      }
    );
  });
  app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
  });
  `)
  classBuilder.push(
    `})().catch((err) => console.error(err)).then(() => console.log('server exited'));`
  )
  return convertImports(importsBuilder).concat(classBuilder.join('\n'))
}

function getModelName(dataType: string, models: Model[]) {
  const model = models.find(m => m._id.toString() === dataType)
  if (!model) {
    return dataType
  }
  return model.name
}

async function generateEntityFile(model: Model, models: Model[]) {
  const importsBuilder: Import = {}
  importsBuilder['mongoose'] = {
    ObjectId: { type: 'single' },
  }
  importsBuilder['type-graphql'] = {
    ObjectType: { type: 'single' },
    Field: { type: 'single' },
  }
  importsBuilder['@typegoose/typegoose'] = {
    prop: { type: 'single', rename: 'Property' },
  }
  importsBuilder['../utils/object-id.scalar'] = {
    ObjectIdScalar: { type: 'single' },
  }
  importsBuilder['../utils/ref-type'] = {
    Ref: { type: 'single' },
  }
  model.fields
    .filter(f => !checkTypeForPrimitive(f.dataType))
    .forEach(f => {
      const modelName = getModelName(f.dataType, models)
      importsBuilder[`../${modelName}/${modelName}.entity`] = {
        [modelName]: {
          type: 'single',
        },
      }
    })
  const classBuilder = ['\n'] as string[]
  classBuilder.push(generateConnections(model.name))
  classBuilder.push('\n')
  classBuilder.push(`@ObjectType()`)
  classBuilder.push(`export class ${model.name} {`)
  classBuilder.push(`  @Field(type => ObjectIdScalar)`)
  classBuilder.push(`  readonly _id!: ObjectId;`)
  classBuilder.push(
    (
      await Promise.all(
        model.fields.map(
          async field => await generateEntityField(field, models)
        )
      )
    ).join('\n')
  )
  classBuilder.push(`}`)
  return convertImports(importsBuilder).concat(classBuilder.join('\n'))
}

async function generateInputFile(model: Model, models: Model[]) {
  const importsBuilder: Import = {}
  importsBuilder['type-graphql'] = {
    Field: { type: 'single' },
    InputType: { type: 'single' },
  }
  importsBuilder['mongoose'] = {
    ObjectId: { type: 'single' },
  }
  importsBuilder['../utils/object-id.scalar'] = {
    ObjectIdScalar: { type: 'single' },
  }
  importsBuilder[`./${model.name}.entity`] = {
    [model.name]: { type: 'single' },
  }
  const fields = model.fields
    .filter(f => checkTypeForPrimitive(f.dataType))
    .map(f => ({
      ...f,
      dataType: getModelName(f.dataType, models),
    }))
  fields.forEach(f => {
    if (!importsBuilder[`../common.input`]) {
      importsBuilder[`../common.input`] = {}
    }
    importsBuilder[`../common.input`][`Model${f.dataType}Input`] = {
      type: 'single',
    }
  })
  const classBuilder = []
  classBuilder.push('\n')
  classBuilder.push(
    generateCreateInput({
      typename: model.name,
      keys: fields,
    })
  )
  classBuilder.push('\n')
  classBuilder.push(
    generateUpdateInput({
      typename: model.name,
      keys: fields,
    })
  )
  classBuilder.push('\n')
  classBuilder.push(
    generateDeleteInput({
      typename: model.name,
    })
  )
  classBuilder.push('\n')
  classBuilder.push(
    generateConditionalInput({
      typename: model.name,
      keys: fields,
    })
  )
  classBuilder.push('\n')
  classBuilder.push(
    generateFilterInput({
      typename: model.name,
      keys: fields,
    })
  )
  return convertImports(importsBuilder).concat(classBuilder.join('\n'))
}

async function generateModelFile(models: Model[]) {
  const importsBuilder = [
    `import { getModelForClass } from "@typegoose/typegoose";`,
  ]
  const exportsBuilder = [] as string[]
  models.forEach(model => {
    importsBuilder.push(
      `import { ${model.name} } from "./${model.name}/${model.name}.entity";`
    )
    exportsBuilder.push(
      `export const ${model.name}Model = getModelForClass(${model.name});`
    )
  })
  return importsBuilder.concat(exportsBuilder).join('\n')
}

async function generateResolver(model: Model, models: Model[]) {
  const importBuilder: Import = {}
  importBuilder['apollo-server'] = {
    ApolloError: { type: 'single' },
  }
  importBuilder['mongoose'] = {
    ObjectId: { type: 'single' },
  }
  importBuilder['type-graphql'] = {
    Arg: { type: 'single' },
    Ctx: { type: 'single' },
    Mutation: { type: 'single' },
    Query: { type: 'single' },
    Resolver: { type: 'single' },
    Int: { type: 'single' },
    PubSub: { type: 'single' },
    Publisher: { type: 'single' },
    Subscription: { type: 'single' },
    Field: { type: 'single' },
    Root: { type: 'single' },
    ObjectType: { type: 'single' },
  }
  importBuilder['typedi'] = {
    Service: { type: 'single' },
  }
  importBuilder['../types'] = {
    Context: { type: 'single' },
  }
  importBuilder['../utils/object-id.scalar'] = {
    ObjectIdScalar: { type: 'single' },
  }
  importBuilder['../utils/filter-parser'] = {
    FilterParser: { type: 'default' },
  }
  importBuilder[`./${model.name}.entity`] = {
    [model.name]: { type: 'single' },
    [`Model${model.name}Connection`]: { type: 'single' },
  }
  importBuilder[`./${model.name}.input`] = {
    [`Create${model.name}Input`]: { type: 'single' },
    [`Update${model.name}Input`]: { type: 'single' },
    [`Delete${model.name}Input`]: { type: 'single' },
    [`Model${model.name}ConditionalInput`]: { type: 'single' },
    [`Model${model.name}FilterInput`]: { type: 'single' },
  }
  importBuilder['../Models'] = {
    [`${model.name}Model`]: { type: 'single' },
  }
  importBuilder['../common.input'] = {
    ModelSortDirection: { type: 'single' },
  }
  if (model.fields.some(f => f.isHashed)) {
    importBuilder['argon2'] = {
      hash: { type: 'single' },
      verify: { type: 'single' },
    }
  }
  const classBuilder = ['\n']
  classBuilder.push(`
@ObjectType()
class ${model.name}SubscriptionPayload {
  @Field()
  type!: "CREATE" | "DELETE" | "UPDATE";
  @Field((type) => [ObjectIdScalar])
  _ids!: ObjectId[];
  @Field((type) => [${model.name}])
  items!: ${model.name}[];
}
  `)
  classBuilder.push(`@Service()`)
  classBuilder.push(`@Resolver(of => ${model.name})`)
  classBuilder.push(`export class ${model.name}Resolver {`)
  // Get Query
  classBuilder.push(``)
  classBuilder.push(`  @Query(retuns => ${model.name})`)
  classBuilder.push(
    `  async get${model.name}(@Arg('_id', type => ObjectIdScalar) _id: ObjectId) {`
  )
  classBuilder.push(`    return ${model.name}Model.findById(_id)`)
  classBuilder.push(`  }`)
  // List Query
  classBuilder.push(``)
  classBuilder.push(`  @Query(retuns => Model${model.name}Connection)`)
  classBuilder.push(`  async list${model.name}(
    @Arg('filter', type => Model${model.name}FilterInput, { nullable: true }) filter: Model${model.name}FilterInput, 
    @Arg('sortDirection', type => ModelSortDirection, { nullable: true }) sortDirection: ModelSortDirection, 
    @Arg('limit', type => Int, { nullable: true }) limit: number, 
    @Arg('nextToken', { nullable: true }) nextToken: String, 
    @Ctx() ctx: Context) {`)

  classBuilder.push(
    `    const items = await ${model.name}Model.find(FilterParser()(filter) || {}).limit(limit || 0)`
  )
  classBuilder.push(`  return { nextToken: null, items }`)
  classBuilder.push(`  }`)
  // Create Query
  classBuilder.push('')
  classBuilder.push(`  @Mutation(returns => ${model.name})`)
  classBuilder.push(`  async create${model.name}(
    @Arg('input', type => Create${model.name}Input) input: Create${
    model.name
  }Input, 
    @Arg('condition', type => Model${
      model.name
    }ConditionalInput, { nullable: true }) condition: Model${
    model.name
  }ConditionalInput,
    @PubSub("${model.name.toUpperCase()}_CHANGE") publish: Publisher<${
    model.name
  }SubscriptionPayload>,
    @Ctx() ctx: Context) {`)
  classBuilder.push(`    const newItem = await ${model.name}Model.create({`)
  classBuilder.push(`      ...input,`)
  model.fields
    .filter(f => f.isHashed)
    .forEach(f =>
      classBuilder.push(
        `        ${f.fieldName}: await hash(input.${f.fieldName}),`
      )
    )
  classBuilder.push(`    })`)
  classBuilder.push(
    `    publish({ type: 'CREATE', _ids: [newItem._id], items: [newItem] })`
  )
  classBuilder.push(`    return newItem`)
  classBuilder.push(`  }`)
  // Delete Query
  classBuilder.push('')
  classBuilder.push(`  @Mutation(returns => ${model.name}, { nullable: true })`)
  classBuilder.push(`  async delete${model.name}(
    @Arg('input', type => Delete${model.name}Input) input: Delete${
    model.name
  }Input, 
    @Arg('condition', type => Model${
      model.name
    }ConditionalInput, { nullable: true }) condition: Model${
    model.name
  }ConditionalInput,
    @PubSub("${model.name.toUpperCase()}_CHANGE") publish: Publisher<${
    model.name
  }SubscriptionPayload>,
    @Ctx() ctx: Context) {`)
  classBuilder.push(
    `    const deletedItem = await ${model.name}Model.findByIdAndDelete(input._id)`
  )
  classBuilder.push(`    if(deletedItem) {`)
  classBuilder.push(
    `      publish({ type: 'DELETE', _ids: [deletedItem._id], items: [] })`
  )
  classBuilder.push(`      return deletedItem`)
  classBuilder.push(`    }`)
  classBuilder.push(`  }`)
  classBuilder.push('')
  // Update Query
  classBuilder.push(`  @Mutation(returns => ${model.name}, { nullable: true })`)
  classBuilder.push(`  async update${model.name}(
    @Arg('input', type => Update${model.name}Input) input: Update${
    model.name
  }Input, 
    @Arg('condition', type => Model${
      model.name
    }ConditionalInput, { nullable: true }) condition: Model${
    model.name
  }ConditionalInput,
    @PubSub("${model.name.toUpperCase()}_CHANGE") publish: Publisher<${
    model.name
  }SubscriptionPayload>,
    @Ctx() ctx: Context) {`)
  classBuilder.push(`    const updatedItem = await ${model.name}Model.findOneAndUpdate(FilterParser()(condition) || {}, 
    { 
      $set: {
        ...input,`)
  model.fields
    .filter(f => f.isHashed)
    .forEach(f =>
      classBuilder.push(
        `      ${f.fieldName}: input.${f.fieldName} ? await hash(input.${f.fieldName}) : undefined,`
      )
    )
  classBuilder.push(`    }}, { returnDocument: 'after' })`)
  classBuilder.push(`    if (updatedItem) {`)
  classBuilder.push(
    `      publish({ type: "UPDATE", _ids: [updatedItem._id], items: [updatedItem] })`
  )
  classBuilder.push(`      return updatedItem`)
  classBuilder.push(`    }`)
  classBuilder.push(`  }`)

  // subscriptions
  classBuilder.push('')
  classBuilder.push(`  @Subscription(returns => ${
    model.name
  }SubscriptionPayload, {
    topics: "${model.name.toUpperCase()}_CHANGE"
  })`)
  classBuilder.push(`  async on${model.name}Change(
    @Root() ${model.name}Subscription: ${model.name}SubscriptionPayload,
    @Arg('filter', type => Model${model.name}FilterInput, { nullable: true }) filter: Model${model.name}FilterInput, 
    @Ctx() ctx: any) {`)
  classBuilder.push(`    return ${model.name}Subscription`)
  classBuilder.push(`  }`)

  // field resolvers

  classBuilder.push(`}`)
  return convertImports(importBuilder).concat(classBuilder.join('\n'))
}

async function generateEntityField(field: Field, models: Model[]) {
  const fieldBuilder = [] as string[]
  let modelName: string = ''
  const isPrimitive = checkTypeForPrimitive(field.dataType)
  if (!isPrimitive) {
    modelName = getModelName(field.dataType, models)
  }
  if (!field.isHashed) {
    fieldBuilder.push(
      `  @Field(type => ${field.isList ? '[' : ''}${
        isPrimitive ? field.dataType : modelName
      }${field.isList ? ']' : ''}, { nullable: ${field.nullable} })`
    )
  }
  // TODO: Unique
  const propertyBuilder = {} as { [key: string]: string }
  if (!isPrimitive) {
    propertyBuilder.ref = `() => ${modelName}`
  }
  if (field.isList) {
    propertyBuilder.default = `[]`
  }
  if (field.isUnique) {
    propertyBuilder.unique = 'true'
  }
  propertyBuilder.nullable = `${field.nullable}`
  fieldBuilder.push(
    `  @Property({ ${Object.keys(propertyBuilder)
      .map(key => `${key}: ${propertyBuilder[key]}`)
      .join(', ')} })`
  )
  fieldBuilder.push(
    `  ${field.fieldName}!: ${
      isPrimitive ? field.dataType.toLowerCase() : `Ref<${modelName}>`
    }${field.isList ? '[]' : ''}`
  )
  return fieldBuilder.join('\n')
}

async function createProjectStructure(
  payload: JsonInputFile,
  projectId: string
) {
  const modelsImportsBuilder = [
    `import { getModelForClass } from "@typegoose/typegoose";`,
  ]
  const modelsBuilder = [] as string[]
  const workdir = path.join('/tmp', projectId)
  fs.rmSync(workdir, { recursive: true, force: true })
  const srcdir = path.join(workdir, 'src')
  const biolerplatedir = path.join(__dirname, 'boilerplate')
  const models = payload.apiConfig.models
  await fs.ensureDir(workdir)
  await fs.writeFile(
    path.join(workdir, 'package.json'),
    generatePackageJson(projectId)
  )

  await fs.copyFile(
    path.join(biolerplatedir, 'tsconfig.json'),
    path.join(workdir, 'tsconfig.json')
  )
  await fs.ensureDir(srcdir)
  await fs.writeFile(
    path.join(srcdir, 'index.ts'),
    generateIndexFile(payload, models, projectId)
  )
  await fs.copyFile(
    path.join(biolerplatedir, 'common.input.ts'),
    path.join(srcdir, 'common.input.ts')
  )
  const utilsdir = path.join(srcdir, 'utils')
  await fs.ensureDir(utilsdir)
  await fs.copyFile(
    path.join(biolerplatedir, 'object-id.scalar.ts'),
    path.join(utilsdir, 'object-id.scalar.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 'ref-type.ts'),
    path.join(utilsdir, 'ref-type.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 'typegoose-middleware.ts'),
    path.join(utilsdir, 'typegoose-middleware.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 'consts.ts'),
    path.join(utilsdir, 'consts.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 'auth-checker.ts'),
    path.join(utilsdir, 'auth-checker.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 'filter-parser.ts'),
    path.join(utilsdir, 'filter-parser.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 's3-uploader.ts'),
    path.join(utilsdir, 'mail-client.ts')
  )
  await fs.copyFile(
    path.join(biolerplatedir, 's3-uploader.ts'),
    path.join(utilsdir, 's3-uploader.ts')
  )
  await fs.writeFile(
    path.join(utilsdir, 'config.ts'),
    `
import * as dotenv from 'dotenv'
const packageJsonInfo = require('../../package.json')

dotenv.config();

type EmailClient = OAuthEmailClient | SimpleEmailClient;

interface OAuthEmailClient {
  type: "OAuth2";
  service: string;
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  expires: number;
}

interface SimpleEmailClient {
  type: "Simple";
  host: string;
  port: number;
  user: string;
  pass: string;
}

if (!process.env.SESSION_SECRET) { throw new Error('SESSION_SECRET is missing')}
if (!process.env.MONGO_DB_URL) { throw new Error('MONGO_DB_URL is missing')}
if (!process.env.DATABASE_NAME) { throw new Error('DATABASE_NAME is missing')}
if (!process.env.REDIS_URL) { throw new Error('REDIS_URL is missing')}
if (!process.env.REDIS_PORT) { throw new Error('REDIS_PORT is missing')}
if (!process.env.PORT) { throw new Error('PORT is missing')}
if (!process.env.S3_ACCESS_KEY) { throw new Error('S3_ACCESS_KEY is missing')}
if (!process.env.S3_SECRET) { throw new Error('S3_SECRET is missing')}
if (!process.env.S3_BUCKET_NAME) { throw new Error('S3_BUCKET_NAME is missing')}
if (!process.env.APP_ENDPOINT) { throw new Error("APP_ENDPOINT is missing")}
if (!process.env.FROM_EMAIL_ADDRESS) { throw new Error("FROM_EMAIL_ADDRESS is missing")}

let emailClient: EmailClient;
// email type could be mailtrap or google
if (process.env.EMAL_TYPE === "OAuth2") {
  if (!process.env.EMAIL_SERVICE) {
    throw new Error("EMAIL_SERVICE is missing");
  }
  if (!process.env.EMAIL_TYPE) {
    throw new Error("EMAIL_TYPE is missing");
  }
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing");
  }
  if (!process.env.EMAIL_CLIENT_ID) {
    throw new Error("EMAIL_CLIENT_ID is missing");
  }
  if (!process.env.EMAIL_CLIENT_SECRET) {
    throw new Error("EMAIL_CLIENT_SECRET is missing");
  }
  if (!process.env.EMAIL_REFRESH_TOKEN) {
    throw new Error("EMAIL_REFRESH_TOKEN is missing");
  }
  if (!process.env.EMAIL_EXPIRES) {
    throw new Error("EMAIL_EXPIRES is missing");
  }

  emailClient = {
    type: "OAuth2",
    user: process.env.EMAL_USER,
    service: process.env.EMAL_USER,
    clientId: process.env.EMAL_CLIENT_ID,
    clientSecret: process.env.EMAL_CLIENT_SECRET,
    refreshToken: process.env.EMAL_REFRESH_TOKEN,
    expires: +process.env.EMAIL_EXPIRES,
  };
} else {
  if (!process.env.EMAIL_HOST) {
    throw new Error("EMAIL_HOST is missing");
  }
  if (!process.env.EMAIL_PORT) {
    throw new Error("EMAIL_PORT is missing");
  }
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing");
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error("EMAIL_PASS is missing");
  }
  if (!process.env.APP_ENDPOINT) {
    throw new Error("APP_ENDPOINT is missing");
  }
  if (!process.env.FROM_EMAIL_ADDRESS) {
    throw new Error("FROM_EMAIL_ADDRESS is missing");
  }

  emailClient = {
    type: "Simple",
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  };
}

export const SERVER_VERSION = packageJsonInfo.version
export const SESSION_SECRET = process.env.SESSION_SECRET
export const MONGO_DB_URL = process.env.MONGO_DB_URL
export const DATABASE_NAME = process.env.DATABASE_NAME
export const REDIS_URL = process.env.REDIS_URL
export const REDIS_PORT = +process.env.REDIS_PORT
export const PORT = +process.env.PORT
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
export const S3_SECRET = process.env.S3_SECRET
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
export const EMAIL_CLIENT = emailClient
export const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS
export const APP_ENDPOINT = process.env.APP_ENDPOINT
    `
  )

  await Promise.all(
    models.map(async model => {
      const modelFolder = path.join(srcdir, model.name)
      await fs.ensureDir(modelFolder)
      await fs.writeFile(
        path.join(modelFolder, `${model.name}.resolver.ts`),
        await generateResolver(model, models)
      )
      await fs.writeFile(
        path.join(modelFolder, `${model.name}.entity.ts`),
        await generateEntityFile(model, models)
      )
      modelsImportsBuilder.push(
        `import { ${model.name} } from './${model.name}/${model.name}.entity`
      )
      modelsBuilder.push(
        `export const ${model.name}Model = getModelForClass(${model.name});`
      )
      await fs.writeFile(
        path.join(modelFolder, `${model.name}.input.ts`),
        await generateInputFile(model, models)
      )
      await fs.ensureDir(modelFolder)
    })
  )
  await fs.writeFile(
    path.join(srcdir, 'Models.ts'),
    await generateModelFile(models)
  )
  await fs.writeFile(
    path.join(srcdir, 'types.ts'),
    `
import { Redis } from "ioredis";
import { Request as ExpressRequest, Response } from "express";
import { Session, SessionData } from "express-session";

export interface Request extends ExpressRequest {
  session: Session & Partial<{
    email: string,
    userId: ObjectId,
    data?: {
      token: string,
    }
  }>
}

export interface Context {
  req: Request,
  redis: Redis
  res: Response,
}
      `
  )
  if (payload.authConfig.requiresAuth) {
    const modelFolder = path.join(srcdir, 'Authentication')
    await fs.ensureDir(modelFolder)
    await fs.writeFile(
      path.join(modelFolder, `Authentication.resolver.ts`),
      await generateAuthenticationResolver(payload, models)
    )
  }
  return
}

function generatePackageJson(projectId: string): any {
  return `{
    "name": "fuchsia-${projectId}",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "scripts": {
      "build": "tsc",
      "start": "ts-node src/index.ts",
      "start:dev": "NODE_TLS_REJECT_UNAUTHORIZED='0' DEBUG=express-session nodemon --watch src -e ts --exec \\"yarn start\\""
    },
    "dependencies": {
      "@typegoose/typegoose": "^9.6.2",
      "apollo-server": "^3.6.3",
      "argon2": "^0.28.4",
      "body-parser": "^1.19.1",
      "class-validator": "^0.13.2",
      "connect-redis": "^6.1.1",
      "cookie-parser": "^1.4.6",
      "cors": "^2.8.5",
      "dotenv": "^16.0.0",
      "express-session": "^1.17.2",
      "graphql": "^15.3.0",
      "graphql-redis-subscriptions": "^2.4.2",
      "graphql-type-json": "^0.3.2",
      "graphql-upload": "^13.0.0",
      "ioredis": "^4.28.5",
      "jsonwebtoken": "^8.5.1",
      "lexorank": "^1.0.4",
      "mongoose": "^6.2.1",
      "reflect-metadata": "^0.1.13",
      "subscriptions-transport-ws": "^0.11.0",
      "type-graphql": "^1.1.1",
      "typedi": "^0.10.0",
      "uuid": "^8.3.2"
    },
    "devDependencies": {
      "@types/connect-redis": "^0.0.18",
      "@types/cookie-parser": "^1.4.2",
      "@types/express-session": "^1.17.4",
      "@types/ioredis": "^4.28.8",
      "@types/node": "^17.0.17",
      "@types/uuid": "^8.3.4",
      "nodemon": "^2.0.15",
      "ts-node": "^10.5.0",
      "typescript": "^4.5.5"
    }
  }`
}
function generateAuthenticationResolver(
  payload: JsonInputFile,
  models: Model[]
): any {
  const importsBuilder: Import = {}
  const classBuilder = [] as string[]
  const authModel = models.find(
    m => m._id.toString() === payload.authConfig.tableId.toString()
  )
  if (authModel) {
    importsBuilder['apollo-server'] = {
      ApolloError: { type: 'single' },
    }
    importsBuilder['mongoose'] = {
      ObjectId: { type: 'single' },
    }
    importsBuilder['type-graphql'] = {
      Arg: { type: 'single' },
      Ctx: { type: 'single' },
      Mutation: { type: 'single' },
      Query: { type: 'single' },
      Resolver: { type: 'single' },
      Int: { type: 'single' },
      PubSub: { type: 'single' },
      Publisher: { type: 'single' },
      Subscription: { type: 'single' },
      Field: { type: 'single' },
      Root: { type: 'single' },
      ObjectType: { type: 'single' },
    }
    importsBuilder['typedi'] = {
      Service: { type: 'single' },
    }
    importsBuilder['../types'] = {
      Context: { type: 'single' },
    }
    importsBuilder['../utils/object-id.scalar'] = {
      ObjectIdScalar: { type: 'single' },
    }
    importsBuilder[`../${authModel.name}/${authModel.name}.entity`] = {
      [authModel.name]: { type: 'single' },
    }
    importsBuilder[`../${authModel.name}/${authModel.name}.input`] = {
      [`Create${authModel.name}Input`]: { type: 'single' },
    }
    importsBuilder[`../Models`] = {
      [`${authModel.name}Model`]: { type: 'single' },
    }
    importsBuilder['argon2'] = {
      hash: { type: 'single' },
      verify: { type: 'single' },
    }
    importsBuilder['../utils/consts'] = {
      COOKIE_NAME: { type: 'single' },
    }

    const usernameField = authModel.fields.find(
      f => f._id.toString() === payload.authConfig.usernameFieldId.toString()
    )
    const passwordField = authModel.fields.find(
      f => f._id.toString() === payload.authConfig.passwordFieldId.toString()
    )
    if (!usernameField || !passwordField) {
      throw new Error('Misconfigured')
    }
    classBuilder.push(``)
    classBuilder.push(`@Service()`)
    classBuilder.push(`@Resolver()`)
    classBuilder.push('export class AuthenticationResolver {')
    // Me resolver
    classBuilder.push(`  @Query(() => User, { nullable: true })`)
    classBuilder.push(`  async me(@Ctx() ctx: Context) {`)
    classBuilder.push(`    if (!ctx.req.session.email) {`)
    classBuilder.push(`      throw new ApolloError("Unauthorized");`)
    classBuilder.push(`    }`)
    classBuilder.push(
      `  return ${authModel.name}Model.findOne({ ${usernameField.fieldName}: ctx.req.session.email });`
    )
    classBuilder.push(`  }`)
    classBuilder.push(``)
    // Login resolver
    classBuilder.push(`  @Mutation(() => String)`)
    classBuilder.push(`  async login(`)
    classBuilder.push(
      `    @Arg("${usernameField.fieldName}") ${usernameField.fieldName}: string,`
    )
    classBuilder.push(
      `    @Arg("${passwordField.fieldName}") ${passwordField.fieldName}: string,`
    )
    classBuilder.push(`    @Ctx() ctx: Context`)
    classBuilder.push(`  ) {`)
    classBuilder.push(
      `    const user = await ${authModel.name}Model.findOne({ email: ${
        payload.authConfig.usernameCaseSensitive
          ? usernameField.fieldName
          : `${usernameField.fieldName}.toLowerCase()`
      } });`
    )
    classBuilder.push(`    if (!user) {`)
    classBuilder.push(`      throw new ApolloError("Login error");`)
    classBuilder.push(`    }`)
    classBuilder.push(
      `    const valid = await verify(user.${passwordField.fieldName}, ${passwordField.fieldName});`
    )
    classBuilder.push(`    if (!valid) {`)
    classBuilder.push(`      throw new ApolloError("Login error");`)
    classBuilder.push(`    }`)
    classBuilder.push(
      `    ctx.req.session.email = user.${usernameField.fieldName};`
    )
    classBuilder.push(`    ctx.req.session.userId = user._id;`)
    classBuilder.push(`    return ctx.req.session.id;`)
    classBuilder.push(`  }`)
    classBuilder.push('')
    classBuilder.push(`
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context) {
    return new Promise((resolve) =>
      ctx.req.session.destroy((err) => {
        ctx.res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
    `)
    // register resolver
    classBuilder.push(`  @Mutation(() => String)`)
    classBuilder.push(`  async register(`)
    classBuilder.push(
      `    @Arg("input", type => Create${authModel.name}Input) input: Create${authModel.name}Input,`
    )
    classBuilder.push(`    @Ctx() ctx: Context`)
    classBuilder.push(`  ) {`)

    classBuilder.push(`    const user = await ${authModel.name}Model.create({`)
    classBuilder.push(`      ...input,`)
    authModel.fields
      .filter(f => f.isHashed)
      .forEach(f =>
        classBuilder.push(
          `        ${f.fieldName}: await hash(input.${f.fieldName}),`
        )
      )
    classBuilder.push(`    })`)
    classBuilder.push(`    if (!user) {`)
    classBuilder.push(`      throw new ApolloError("Registration error");`)
    classBuilder.push(`    }`)
    classBuilder.push(
      `    ctx.req.session.email = user.${usernameField.fieldName};`
    )
    classBuilder.push(`    ctx.req.session.userId = user._id;`)
    classBuilder.push(`    return ctx.req.session.id;`)
    classBuilder.push(`  }`)

    classBuilder.push('}')
  }
  return convertImports(importsBuilder).concat(classBuilder.join('\n'))
}

export async function GenerateCode(payload: JsonInputFile, projectId: string) {
  await createProjectStructure(payload, projectId)
}
