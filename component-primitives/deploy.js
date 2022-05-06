const axios = require("axios");
const jsonPackage = require("./package.json");
const path = require("path");
const fs = require("fs");

require('dotenv').config();
const useEndpoint = (process.env['GQL_ENDPOINT'] ? process.env['GQL_ENDPOINT'] : "http://localhost:4002/graphql");

function consoleLog(message) {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
}

function getDefaultProps(schema, acc) {
  if (
    schema.type === "object" ||
    schema.type === "ui-component" ||
    schema.type === "layout-component" ||
    schema.type === "array"
  ) {
    //console.log(schema);
    return Object.keys(schema.properties).reduce((obj, key) => {
      obj[key] = getDefaultProps(schema.properties[key], { [key]: {} });
      return obj;
    }, {});
  }
  return schema.default || {};
}

function recursiveSearch(folder, filename, files, output) {
  files = files || fs.readdirSync(folder);
  output = output || [];

  files.forEach((file) => {
    const newPath = path.join(folder, file);
    if (fs.statSync(newPath).isDirectory()) {
      output = recursiveSearch(
        newPath,
        filename,
        fs.readdirSync(newPath),
        output
      );
    } else {
      if (file === filename) {
        output.push(newPath);
      }
    }
  });
  return output;
}

function getPackage() {
  const props = recursiveSearch("./src", "props.json");
  const package = {};
  package.packageName = jsonPackage.name;
  package.repositoryUrl = jsonPackage.repository;
  const bundle = fs.readFileSync(`./public/bundle.js`, { encoding: "utf-8" });
  package.bundle = bundle;
  package.scope = "Global";
  package.authorId = "6209c823d4c7d4df5e7fdf84";
  package.version = jsonPackage.version;
  const componentProps = props.map((prop) => JSON.parse(fs.readFileSync(prop)));
  package.components = [];
  package.components = componentProps.map((component) => ({
    schema: component,
    defaultPropValue: getDefaultProps(component, {}),
    name: component.title || "",
    icon: component.icon || "",
    componentType: component.componentType,
  }));
  return package;
}

(async () => {
  try {
    //console.log(getPackage());
    const response = await axios.post(useEndpoint, {
      operationName: "CreatePackage",
      query: `mutation CreatePackage($packageInput: PackageInput!) {
        createPackage(packageInput: $packageInput) {
          _id
        }
      }`,
      variables: {
        packageInput: getPackage(),
      },
    });
    consoleLog(response);
    consoleLog(JSON.stringify(response.data, null, 2));
  } catch (e) {
    consoleLog(e);
    throw e;
  }
})()
  .then(() => console.log(`Deploy Successful`))
  .catch((error) => console.error(`Error: ${error}`))
  .finally(() => console.log('Run Complete'));
