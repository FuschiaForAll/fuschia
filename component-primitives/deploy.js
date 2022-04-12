/**
 * 1. load bundled file
 * 2.
 *
 */
const axios = require("axios");
const jsonPackage = require("./package.json");
const path = require("path");
const fs = require("fs");

function getDefaultProps(schema, acc) {
  if (
    schema.type === "object" ||
    schema.type === "ui-component" ||
    schema.type === "array"
  ) {
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
    defaultValue: getDefaultProps(component, {}),
    name: component.title || "",
    icon: component.icon || "",
    componentType: component.componentType,
  }));
  return package;
}

(async () => {
  try {
    console.log(getPackage());
    const response = await axios.post("http://localhost:4002/graphql", {
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
    console.log(response);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (e) {
    console.log(e);
    throw e;
  }
})()
  .catch((error) => console.error(`error: ${error}`))
  .then(() => console.log(`completed`));
