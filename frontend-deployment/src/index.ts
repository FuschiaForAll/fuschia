// get the project structure
import { MongoClient, ObjectId, Db } from 'mongodb'
import fs, { CopyOptions } from 'fs-extra'
import path from 'path'
import {
  ArrayHookVariable,
  convertHooks,
  convertImports,
  DestructedHookVariable,
  draftJsStuff,
  functionBuilder,
  generateAuthGraphqlFiles,
  generateEntityModelGraphqlFiles,
  generateRootNavigator,
  Hooks,
  HookVariable,
  Import,
  MultipleHookVariable,
} from './utils'
import { ActionProps, ObjectSchema, Schema } from '@fuchsia/types'
import { Component, Package, Project } from './types'
import { baseApp } from './boilerplate/App'
import { generateServerSchema } from './schema.builder'
import { exec } from 'child_process'
import { apolloClient } from './boilerplate/apollo-client'

const workdir = path.join(__dirname, '../workdir')
const srcdir = path.join(workdir, 'src')
const starterdir = path.join(__dirname, '../StarterProject')

const specialTypeStructure = {
  'margin': {
    'left': { type: 'string'},
    'right': { type: 'string'},
    'top': { type: 'string'},
    'bottom': { type: 'string'}
  },
  'padding': {
    'left': { type: 'string'},
    'right': { type: 'string'},
    'top': { type: 'string'},
    'bottom': { type: 'string'}
  },
  'flexContainer': {
    'size': { type: 'string'},
    'style': { type: 'string'},
    'weight': { type: 'string'},
    'textAlign': { type: 'string'},
    'textTransform': { type: 'string'},
    'lineHeight': { type: 'string'}
  }
}

async function copyWorkDir() {
  console.log('copy started')
  const files = fs.readdirSync(starterdir)
  await Promise.all(
    files.map(file => {
      if (file === 'node_modules') {
        return
      }
      fs.copy(path.join(starterdir, file), path.join(workdir, file))
    })
  )

  console.log('copy finished')
}

const MAX_DEPTH = 50

async function buildChildStructure(
  fuschiaDb: Db,
  parent: Component,
  depth: number
): Promise<Component> {
  if (depth === MAX_DEPTH) {
    throw new Error('Probably recursive component')
  }
  const children = await fuschiaDb
    .collection('components')
    .find<Component>({
      parent: parent._id,
    })
    .toArray()
  const branches = await Promise.all(
    children.map(child => buildChildStructure(fuschiaDb, child, depth + 1))
  )
  return {
    ...parent,
    children: branches,
  }
}

async function getProjectInfo(mongoDbUrl: string, projectId: string) {
  const mongoClient = new MongoClient(mongoDbUrl)
  try {
    await mongoClient.connect()
    const fuschiaDb = mongoClient.db('fuschia')
    const project = await fuschiaDb.collection('projects').findOne<Project>({
      _id: new ObjectId(projectId),
    })
    if (project) {
      return project
    }
  } finally {
    await mongoClient.close()
  }
  throw new Error('Project does not exist')
}

async function getProjectStructure(mongoDbUrl: string, project: Project) {
  const mongoClient = new MongoClient(mongoDbUrl)
  try {
    await mongoClient.connect()
    const fuschiaDb = mongoClient.db('fuschia')
    // get root components
    const rootElements = await fuschiaDb
      .collection('components')
      .find<Component>({ projectId: project._id, parent: null })
      .toArray()
    // recursively build entiry tree structure
    return await Promise.all(
      rootElements.map(c => buildChildStructure(fuschiaDb, c, 0))
    )
  } finally {
    await mongoClient.close()
  }
}

function getImports(imports: Import, parent: Component) {
  const newImports = { ...imports }
  if (!newImports[parent.package]) {
    newImports[parent.package] = { [parent.type]: 'single' }
  } else {
    newImports[parent.package][parent.type] = 'single'
  }
  if (parent.children) {
    parent.children.forEach(c => getImports(newImports, c))
  }
  return newImports
}

async function buildScreen(
  rootComponent: Component,
  packages: Package[],
  rootComponents: Component[],
  projectInfo: Project
) {
  const hooksBuilder = {} as Hooks
  const importsBuilder = getImports({}, rootComponent)
  importsBuilder.react = {
    React: 'default',
  }
  const functionsBuilder = [] as string[]
  const bableBuilder = [] as string[]

  function buildChild(component: Component, indentation: number) {
    const propsBuilder = [] as string[]
    const _package = packages.find(p => p.packageName === component.package)
    if (_package) {
      const packageComponent = _package.components.find(
        c => c.name === component.type
      )
      if (packageComponent) {
        if (packageComponent.schema.type === 'array') {
          if (component.fetched) {
            component.fetched.map(f => {
              // convert to DraftJS
              const entityType = f.entityType as any
              if (entityType && entityType.blocks) {
                
                const fetchedModel = projectInfo.appConfig.apiConfig.models.find(
                  m => m._id.toString() === entityType.entityMap[0].data[0].value)
                  if (fetchedModel) {
                    // need import for fetch
                    if (!importsBuilder['./generated/graphql']) {
                      importsBuilder['./generated/graphql'] = {}
                    }
                    importsBuilder['./generated/graphql'][
                      `useList${fetchedModel.name}Query`
                    ] = 'single'
                    if (!hooksBuilder[`useList${fetchedModel.name}Query`]) {
                      hooksBuilder[`useList${fetchedModel.name}Query`] = {
                        hook: {
                          type: 'destructed',
                          value: {},
                        },
                      }
                    }
                    ;(
                      hooksBuilder[`useList${fetchedModel.name}Query`]
                        .hook as DestructedHookVariable
                    ).value.data = {
                      type: 'variable',
                      value: `data`,
                      renamed: `${fetchedModel.name}Data`,
                    }
                    // need hook for fetch
                    // need data
                    propsBuilder.push(`${''.padStart(indentation, ' ')}{
                      ${fetchedModel.name}Data?.list${
                      fetchedModel.name
                    }?.items?.map((item, index) => (
                    `)
                    propsBuilder.push(
                      `${''.padStart(indentation, ' ')}<${
                        component.type
                      } key={item._id} index={index}`
                    )
                  }
              }
            })
          }
        } else {
          propsBuilder.push(
            `${''.padStart(indentation, ' ')}<${component.type}`
          )
        }
        importsBuilder.react.useState = 'single'

        const dataComponents = [] as Array<{
          name: string
          type: string
        }>

        // find all packages that emit data
        const findDataBound = (schema: Schema, propKey: string) => {
          switch (schema.type) {
            case 'ui-component':
            case 'layout-component':
            case 'object':
              if (!schema.properties) {
                return
              }
              Object.keys(schema.properties).forEach(key => {
                findDataBound(schema.properties[key], key)
              })
              break
            case 'string':
            case 'number':
            case 'boolean':
              if (schema.dataBound) {
                dataComponents.push({
                  name: propKey,
                  type: schema.type,
                })
              }
              break
          }
          return false
        }

        findDataBound(packageComponent.schema, '')

        dataComponents.forEach(d => {
          if (
            // @ts-ignore
            !hooksBuilder[`useState<${d.type}>`]
          ) {
            // @ts-ignore
            hooksBuilder[`useState<${d.type}>`] = {
              hook: {
                type: 'multiple',
                value: [],
              },
            }
          }
          ;(
            hooksBuilder[
              // @ts-ignore
              `useState<${d.type}>`
            ].hook as MultipleHookVariable
          ).value.push({
            type: 'array',
            value: [
              {
                type: 'variable',
                value: `${component.name}${d.name}`,
              },
              {
                type: 'variable',
                value: `set${component.name}${d.name}`,
              },
            ],
          })
          propsBuilder.push(
            // @ts-ignore
            `${d.name}={{ value: ${component.name}${d.name}, onChange: set${component.name}${d.name}}}`
          )
        })
        function convertSchemaProps(
          componentProps: {
            [key: string]: any
          },
          schemaProps: any,
          acc: any
        ) {
          Object.keys(componentProps).forEach(prop => {
            const structure = schemaProps[prop]
            if (structure) {
              switch (structure.type) {
                case 'function':
                  acc[prop] = `${component.name}${prop}`
                  functionsBuilder.push(
                    `async function ${component.name}${prop}() {`
                  )
                  ;(componentProps[prop] as ActionProps[]).forEach(action => {
                    functionBuilder(
                      action,
                      importsBuilder,
                      hooksBuilder,
                      rootComponents,
                      functionsBuilder,
                      projectInfo,
                      packages
                    )
                  })
                  functionsBuilder.push(`}`)
                  break
                case 'string':
                  acc[prop] = draftJsStuff(
                    componentProps[prop],
                    rootComponents,
                    projectInfo,
                    packages
                  )
                  break
                case 'object':
                  acc[prop] = convertSchemaProps(
                    componentProps[prop],
                    structure.properties,
                    {}
                  )
                  break
                case 'flexContainer':
                case 'margin':
                case 'padding':
                  acc[prop] = convertSchemaProps(
                    componentProps[prop],
                    // @ts-ignore
                    specialTypeStructure[structure.type],
                    {}
                  )

                  break
                case 'array':
                  break
                default:
                  acc[prop] = componentProps[prop]
              }
            }
          })
          return acc
        }
        // @ts-ignore
        const props = convertSchemaProps(
          component.props,
          // @ts-ignore
          packageComponent.schema.properties,
          {}
        )
        Object.keys(props).forEach(prop => {
          propsBuilder.push(`${prop}={${JSON.stringify(props[prop])}}`)

          // // @ts-ignore
          // const structure = packageComponent.schema.properties[prop]
          // if (structure) {
          //   console.log(structure)
          //   switch (structure.type) {
          //     case 'function':
          //       // functions need to be converted to function rather than configuration strings
          //       propsBuilder.push(`${prop}={async () => {`)
          //       ;(component.props[prop] as ActionProps[]).forEach(action => {
          //         functionBuilder(
          //           action,
          //           importsBuilder,
          //           hooksBuilder,
          //           rootComponents,
          //           propsBuilder,
          //           projectInfo,
          //           packages
          //         )
          //       })
          //       propsBuilder.push(`} }`)
          //       break
          //     case 'string':
          //       console.log(`STRING`)
          //       console.log(component.props[prop])
          //       propsBuilder.push(
          //         `${prop}={\`${draftJsStuff(
          //           component.props[prop],
          //           rootComponents,
          //           projectInfo,
          //           packages
          //         )}\`}`
          //       )
          //       break
          //     case 'object':
          //       propsBuilder.push(
          //         `${prop}={${JSON.stringify(component.props[prop])}}`
          //       )
          //       break
          //     case 'array':
          //       break
          //     default:
          //       // the rest need to be stripped of DraftJS if applicable
          //       propsBuilder.push(`${prop}={${component.props[prop]}}`)
          //       break
          //   }
          // }
        })
        if (component.children && component.children.length > 0) {
          propsBuilder.push('>')
          bableBuilder.push(propsBuilder.join(' '))
          component.children.forEach(child =>
            buildChild(child, indentation + 3)
          )
          bableBuilder.push(
            `${''.padStart(indentation, ' ')}</${component.type}>`
          )

          if (packageComponent.schema.type === 'array') {
            bableBuilder.push(`))}`)
          }
        } else {
          propsBuilder.push('/>')
          bableBuilder.push(propsBuilder.join(' '))
        }
      }
    }
  }

  console.log(`building screen for ${rootComponent.name}`)
  const file = path.join(srcdir, `${rootComponent.name}.tsx`)
  await fs.createFile(file)
  const fileBuilder = []
  if (rootComponent.children) {
    rootComponent.children.forEach(child => buildChild(child, 9))
  }
  if (rootComponent.requiresAuth) {
    // need import for fetch
    if (!importsBuilder['./generated/graphql']) {
      importsBuilder['./generated/graphql'] = {}
    }
    importsBuilder['./generated/graphql'][`useMeQuery`] = 'single'
    if (!hooksBuilder[`useMeQuery`]) {
      hooksBuilder[`useMeQuery`] = {
        hook: {
          type: 'destructed',
          value: {},
        },
      }
    }
    ;(hooksBuilder[`useMeQuery`].hook as DestructedHookVariable).value.data = {
      type: 'variable',
      value: `data`,
      renamed: `meData`,
    }
  }
  if (rootComponent.parameters && rootComponent.parameters.length > 0) {
    if (!importsBuilder['./generated/graphql']) {
      importsBuilder['./generated/graphql'] = {}
    }
    rootComponent.parameters.forEach(p => {
      const parameterModel = projectInfo.appConfig.apiConfig.models.find(
        m => m._id.toString() === p.entityType.toString()
      )
      if (parameterModel) {
        importsBuilder['@react-navigation/native'][`useRoute`] = 'single'
        if (!hooksBuilder[`useRoute`]) {
          hooksBuilder[`useRoute`] = {
            hook: {
              type: 'variable',
              value: 'route',
            },
          }
        }
        importsBuilder['./generated/graphql'][
          `useGet${parameterModel.name}Query`
        ] = 'single'
        if (!hooksBuilder[`useGet${parameterModel.name}Query`]) {
          hooksBuilder[`useGet${parameterModel.name}Query`] = {
            hook: {
              type: 'destructed',
              value: {},
            },
            parameters: {
              variables: {
                _id: `route.params.${parameterModel.name}Id`,
              },
            },
          }
        }
        ;(
          hooksBuilder[`useGet${parameterModel.name}Query`]
            .hook as DestructedHookVariable
        ).value.data = {
          type: 'variable',
          value: `data`,
          renamed: `${parameterModel.name}Data`,
        }
      }
    })
  }
  fileBuilder.push(`export function ${rootComponent.name} () {`)
  fileBuilder.push(convertHooks(hooksBuilder))
  fileBuilder.push(functionsBuilder.join('\n'))
  fileBuilder.push(`   return (`)
  fileBuilder.push(`      <${rootComponent.type}>`)
  fileBuilder.push(bableBuilder.join('\n'))
  fileBuilder.push()
  fileBuilder.push(`      </${rootComponent.type}>`)
  fileBuilder.push(`   )`)
  fileBuilder.push(`}`)
  await fs.appendFile(file, convertImports(importsBuilder))
  await fs.appendFile(file, '\n')
  await fs.appendFile(file, '\n')
  await fs.appendFile(file, fileBuilder.join('\n'))
}

async function getComponentsSchema(mongoUrl: string) {
  const mongoClient = new MongoClient(mongoUrl)
  try {
    await mongoClient.connect()
    const fuschiaDb = mongoClient.db('fuschia')
    const packages = await fuschiaDb
      .collection('packages')
      .find<Package>(
        {},
        {
          projection: {
            packageName: 1,
            repositoryUrl: 1,
            version: 1,
            components: 1,
            scope: 1,
          },
        }
      )
      .toArray()
    return packages
  } finally {
    await mongoClient.close()
  }
}

;(async () => {
  if (!process.env.MONGO_DB_URL) {
    throw new Error('Missing MONGO_DB_URL')
  }
  if (!process.env.PROJECT_ID) {
    throw new Error('Missing PROJECT_ID')
  }
  const mongoUrl = process.env.MONGO_DB_URL
  const projectId = process.env.PROJECT_ID
  // move starterproject to workdir
  await copyWorkDir()
  const schema = await getComponentsSchema(mongoUrl)
  const projectInfo = await getProjectInfo(mongoUrl, projectId)
  const project = await getProjectStructure(mongoUrl, projectInfo)
  // create server schema
  await fs.writeFile(
    path.join(workdir, 'schema.graphql'),
    generateServerSchema(projectInfo),
    { flag: 'w' }
  )
  await generateAuthGraphqlFiles(srcdir, projectInfo)
  await generateEntityModelGraphqlFiles(srcdir, projectInfo)
  // run apollo codegen
  await new Promise((resolve, reject) =>
    exec(`cd ${workdir} && yarn gen`, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      }
      if (stdout) {
        console.error(stdout)
      }
      if (stderr) {
        console.error(stderr)
      }
      resolve(1)
    })
  )

  await fs.writeFile(
    path.join(srcdir, 'RootNavigator.tsx'),
    generateRootNavigator(project, projectInfo.appConfig.appEntryComponentId),
    { flag: 'w' }
  )
  await fs.writeFile(path.join(srcdir, 'App.tsx'), baseApp)
  await fs.writeFile(path.join(srcdir, 'apollo-client.tsx'), apolloClient)
  project.forEach(component =>
    buildScreen(component, schema, project, projectInfo)
  )
})()
  .catch(e => console.error(e))
  .then(() => console.log(`build completed`))
