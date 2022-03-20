const {
  ModelIDInput,
  ModelSizeInput,
  ModelAttributeTypes,
  ModelStringInput,
  ModelBooleanInput,
  ModelSortDirection,
} = require("./api.consts");
const { resolver } = require("./resolver");

function checkTypeForPrimitive(type) {
  switch (type) {
    case "ID":
    case "String":
    case "Boolean":
    case "Int":
      return true;
  }
  return false;
}

function generateConnections(typename) {
  const builder = [];
  builder.push(`type Model${typename}Connection {`);
  builder.push(`  items: [${typename}]`);
  builder.push(`  nextToken: String`);
  builder.push(`}`);
  return builder.join("\n");
}

function generateCreateInput({ typename, keys, nullable }) {
  const builder = [];
  builder.push(`input Create${typename}Input {`);
  keys.forEach((key) =>
    builder.push(
      `  ${key.fieldName.replaceAll(" ", "")}: ${key.dataType}${
        key.nullable ? "" : "!"
      }`
    )
  );
  builder.push(`}`);
  return builder.join("\n");
}

function generateUpdateInput({ typename, keys }) {
  const builder = [];
  builder.push(`input Update${typename}Input {`);
  builder.push(`  _id: ID!`);
  keys.forEach((key) =>
    builder.push(`  ${key.fieldName.replaceAll(" ", "")}: ${key.dataType}`)
  );
  builder.push(`}`);
  return builder.join("\n");
}

function generateDeleteInput({ typename, keys }) {
  const builder = [];
  builder.push(`input Delete${typename}Input {`);
  builder.push(`  _id: ID!`);
  builder.push(`}`);
  return builder.join("\n");
}

function generateConditionalInput({ typename, keys }) {
  const builder = [];
  builder.push(`input Model${typename}ConditionalInput {`);
  keys.forEach((key) =>
    builder.push(
      `  ${key.fieldName.replaceAll(" ", "")}: Model${key.dataType}Input`
    )
  );
  builder.push(`  and: [Model${typename}ConditionalInput]`);
  builder.push(`  or: [Model${typename}ConditionalInput]`);
  builder.push(`  not: Model${typename}ConditionalInput`);
  builder.push(`}`);
  return builder.join("\n");
}
function generateFilterInput({ typename, keys }) {
  const builder = [];
  builder.push(`input Model${typename}FilterInput {`);
  builder.push(`  _id: ModelIDInput`);
  keys.forEach((key) =>
    builder.push(
      `  ${key.fieldName.replaceAll(" ", "")}: Model${key.dataType}Input`
    )
  );
  builder.push(`  and: [Model${typename}FilterInput]`);
  builder.push(`  or: [Model${typename}FilterInput]`);
  builder.push(`  not: Model${typename}FilterInput`);
  builder.push(`}`);
  return builder.join("\n");
}

async function publish(project) {
  await resolver.connect();
  const resolverBuilder = {
    Query: {},
    Mutation: {},
    Subscription: {},
  };
  global.tableAndFieldNameMap = {};
  global.tableAndFieldIdMap = {};
  const schemaBuilder = [];
  const queryBuilder = ["type Query {"];
  const mutationBuilder = ["type Mutation {"];
  if (project.appConfig.authConfig.requiresAuth) {
    mutationBuilder.push(
      `  login(username: String!, password: String!): String`
    );
    resolverBuilder.Mutation.login = (parent, args, context, info) =>
      resolver.loginResolver(
        project.appConfig.authConfig.tableId.toString(),
        project.appConfig.authConfig.usernameFieldId.toString(),
        project.appConfig.authConfig.passwordFieldId.toString(),
        project.appConfig.authConfig.usernameCaseSensitive,
        args,
        parent,
        context,
        info
      );
    mutationBuilder.push(`  logout: Boolean!`);
    resolverBuilder.Mutation.logout = (parent, args, context, info) =>
      resolver.logoutResolver(
        project.appConfig.authConfig.tableId.toString(),
        project.appConfig.authConfig.usernameFieldId.toString(),
        project.appConfig.authConfig.passwordFieldId.toString(),
        project.appConfig.authConfig.usernameCaseSensitive,
        args
      );
    mutationBuilder.push(
      `  register(username: String!, password: String!): String`
    );
    resolverBuilder.Mutation.register = (parent, args, context, info) =>
      resolver.registerResolver(
        project.appConfig.authConfig.tableId.toString(),
        project.appConfig.authConfig.usernameFieldId.toString(),
        project.appConfig.authConfig.passwordFieldId.toString(),
        args,
        parent,
        context,
        info
      );
  }
  const subscriptionBuilder = ["type Subscription {"];
  const connectionsBuilder = [];
  const createInputsBuilder = [];
  const updateInputsBuilder = [];
  const deleteInputsBuilder = [];
  const filtersBuilder = [];
  const conditionalBuilder = [];
  project.appConfig.apiConfig.models.forEach((model) => {
    const name = model.name.replaceAll(" ", "");
    global.tableAndFieldNameMap[name] = {
      id: model._id.toString(),
      fields: {},
    };
    global.tableAndFieldIdMap[model._id.toString()] = {
      name: model.name.toString(),
      fields: {},
    };
  });
  project.appConfig.apiConfig.models.forEach((model) => {
    const name = model.name.replaceAll(" ", "");
    resolverBuilder.Query[`get${name}`] = (parent, args, context, info) =>
      resolver.genericGetQueryResolver(
        model._id.toString(),
        model.name.replace(" ", ""),
        parent,
        args,
        context,
        info
      );
    resolverBuilder.Query[`list${name}`] = (parent, args, context, info) =>
      resolver.genericListQueryResolver(
        model._id.toString(),
        model.name.replace(" ", ""),
        parent,
        args,
        context,
        info
      );
    queryBuilder.push(`"A Single ${name}"`);
    queryBuilder.push(`  get${name}(_id: ID!): ${name}`);
    queryBuilder.push(`"A List of ${name}s"`);
    queryBuilder.push(
      `  list${name}(filter: Model${name}FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${name}Connection`
    );
    mutationBuilder.push(`"Create a ${name}"`);
    mutationBuilder.push(
      `  create${name}(input: Create${name}Input!, condition: Model${name}ConditionalInput): ${name}`
    );
    resolverBuilder.Mutation[`create${name}`] = (parent, args, context, info) =>
      resolver.genericCreateResolver(
        model._id.toString(),
        model.name,
        parent,
        args.input,
        context,
        info
      );
    mutationBuilder.push(`"Update a ${name}"`);
    mutationBuilder.push(
      `  update${name}(input: Update${name}Input!, condition: Model${name}ConditionalInput): ${name}`
    );
    resolverBuilder.Mutation[`update${name}`] = (parent, args, context, info) =>
      resolver.genericUpdateResolver(
        model._id.toString(),
        model.name,
        parent,
        args,
        context,
        info
      );
    mutationBuilder.push(`"Delete a ${name}"`);
    mutationBuilder.push(
      `  delete${name}(input: Delete${name}Input!, condition: Model${name}ConditionalInput): ${name}`
    );
    resolverBuilder.Mutation[`delete${name}`] = (parent, args, context, info) =>
      resolver.genericDeleteResolver(
        model._id.toString(),
        parent,
        args,
        context,
        info
      );
    subscriptionBuilder.push(`  onCreate${name}: ${name}`);
    subscriptionBuilder.push(`  onUpdate${name}: ${name}`);
    subscriptionBuilder.push(`  onDelete${name}: ${name}`);

    const modelBuilder = [];
    modelBuilder.push(`\ntype ${name} {`);
    modelBuilder.push(`  _id: ID!`);
    model.fields.forEach((field) => {
      global.tableAndFieldNameMap[name].fields[
        field.fieldName.replace(" ", "")
      ] = {
        id: field._id.toString(),
        config: {
          isUnique: field.isUnique,
          isHashed: field.isHashed,
        },
      };
      global.tableAndFieldIdMap[model._id.toString()].fields[
        field._id.toString()
      ] = {
        name: field.fieldName.replace(" ", ""),
        config: {
          isUnique: field.isUnique,
          isHashed: field.isHashed,
        },
      };
      if (field.connection) {
        if (!resolverBuilder[name]) {
          resolverBuilder[name] = {};
        }
        if (field.isList) {
          resolverBuilder[name][field.fieldName.replaceAll(" ", "")] = (
            parent,
            args,
            context,
            info
          ) =>
            resolver.genericFieldListResolver(
              parent,
              args,
              context,
              info,
              field.fieldName,
              field.dataType,
              model.name
            );
          modelBuilder.push(
            `  ${field.fieldName.replaceAll(" ", "")}(filter: Model${
              global.tableAndFieldIdMap[field.dataType].name
            }FilterInput, sortDirection: ModelSortDirection, limit: Int, nextToken: String): Model${
              global.tableAndFieldIdMap[field.dataType].name
            }Connection`
          );
        } else {
          resolverBuilder[name][field.fieldName.replaceAll(" ", "")] = (
            parent,
            args,
            context,
            info
          ) =>
            resolver.genericFieldResolver(
              parent,
              args,
              context,
              info,
              field.fieldName,
              field.dataType,
              model.name
            );
          modelBuilder.push(
            `  ${field.fieldName.replaceAll(" ", "")}: ${
              global.tableAndFieldIdMap[field.dataType].name
            }${field.isHashed || field.nullable ? "" : "!"}`
          );
        }
      } else {
        modelBuilder.push(
          `  ${field.fieldName.replaceAll(" ", "")}: ${field.dataType}${
            field.isHashed || field.nullable ? "" : "!"
          }`
        );
      }
    });
    modelBuilder.push(`}\n`);
    filtersBuilder.push(
      generateFilterInput({
        typename: name,
        keys: model.fields
          .filter((fields) => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType }) => ({
            fieldName: fieldName.replaceAll(" ", ""),
            dataType,
          })),
      })
    );
    conditionalBuilder.push(
      generateConditionalInput({
        typename: name,
        keys: model.fields
          .filter((fields) => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType }) => ({
            fieldName: fieldName.replaceAll(" ", ""),
            dataType,
          })),
      })
    );
    createInputsBuilder.push(
      generateCreateInput({
        typename: name,
        keys: model.fields
          .filter((fields) => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType, nullable }) => ({
            fieldName: fieldName.replaceAll(" ", ""),
            dataType,
            nullable,
          })),
      })
    );
    updateInputsBuilder.push(
      generateUpdateInput({
        typename: name,
        keys: model.fields
          .filter((fields) => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType, nullable }) => ({
            fieldName: fieldName.replaceAll(" ", ""),
            dataType,
            nullable,
          })),
      })
    );
    deleteInputsBuilder.push(
      generateDeleteInput({
        typename: name,
        keys: model.fields
          .filter((fields) => checkTypeForPrimitive(fields.dataType))
          .map(({ fieldName, dataType, nullable }) => ({
            fieldName: fieldName.replaceAll(" ", ""),
            dataType,
            nullable,
          })),
      })
    );
    connectionsBuilder.push(generateConnections(name));
    schemaBuilder.push(modelBuilder.join("\n"));
  });

  queryBuilder.push("}\n");
  schemaBuilder.push(queryBuilder.join("\n"));
  mutationBuilder.push("}\n");
  schemaBuilder.push(mutationBuilder.join("\n"));
  subscriptionBuilder.push("}\n");
  schemaBuilder.push(subscriptionBuilder.join("\n"));
  filtersBuilder.push("\n");
  schemaBuilder.push(filtersBuilder.join("\n"));
  conditionalBuilder.push("\n");
  schemaBuilder.push(conditionalBuilder.join("\n"));
  createInputsBuilder.push("\n");
  schemaBuilder.push(createInputsBuilder.join("\n"));
  updateInputsBuilder.push("\n");
  schemaBuilder.push(updateInputsBuilder.join("\n"));
  deleteInputsBuilder.push("\n");
  schemaBuilder.push(deleteInputsBuilder.join("\n"));
  connectionsBuilder.push("\n");
  schemaBuilder.push(connectionsBuilder.join("\n"));
  schemaBuilder.push(ModelSizeInput);
  schemaBuilder.push(ModelAttributeTypes);
  schemaBuilder.push(ModelStringInput);
  schemaBuilder.push(ModelBooleanInput);
  schemaBuilder.push(ModelIDInput);
  schemaBuilder.push(ModelSortDirection);
  return { typeDefs: schemaBuilder.join("\n"), resolvers: resolverBuilder };
}

exports.publish = publish;
