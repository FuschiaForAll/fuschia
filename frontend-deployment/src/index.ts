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
      .find<Component>({ _id: { $in: project.components } })
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
              const fetchedModel = projectInfo.appConfig.apiConfig.models.find(
                m => m._id.toString() === f.entityType
              )
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
                  } key={item._id}`
                )
              }
            })
          }
        } else {
          propsBuilder.push(
            `${''.padStart(indentation, ' ')}<${component.type}`
          )
        }
        importsBuilder.react.useState = 'single'
        // @ts-ignore
        if (packageComponent.schema && packageComponent.schema.data) {
          // @ts-ignore
          Object.keys(packageComponent.schema.data).forEach(d => {
            if (
              // @ts-ignore
              !hooksBuilder[`useState<${packageComponent.schema.data[d]}>`]
            ) {
              // @ts-ignore
              hooksBuilder[`useState<${packageComponent.schema.data[d]}>`] = {
                hook: {
                  type: 'multiple',
                  value: [],
                },
              }
            }
            ;(
              hooksBuilder[
                // @ts-ignore
                `useState<${packageComponent.schema.data[d]}>`
              ].hook as MultipleHookVariable
            ).value.push({
              type: 'array',
              value: [
                {
                  type: 'variable',
                  value: `${component.name}${d}`,
                },
                {
                  type: 'variable',
                  value: `set${component.name}${d}`,
                },
              ],
            })
            propsBuilder.push(
              // @ts-ignore
              `${d}={{ value: ${component.name}${d}, onChange: set${component.name}${d}}}`
            )
          })
        }
        Object.keys(component.props).forEach(prop => {
          // @ts-ignore
          const structure = packageComponent.schema.properties[prop]
          if (structure) {
            switch (structure.type) {
              case 'function':
                // functions need to be converted to function rather than configuration strings
                propsBuilder.push(`${prop}={async () => {`)
                function actionBuilder(action: ActionProps) {
                  switch (action.type) {
                    case 'NAVIGATE':
                      importsBuilder['@react-navigation/native'] = {
                        useNavigation: 'single',
                      }
                      if (!hooksBuilder['useNavigation<any>']) {
                        hooksBuilder['useNavigation<any>'] = {
                          hook: {
                            type: 'variable',
                            value: 'navigate',
                          },
                        }
                      }
                      const targetScreen = rootComponents.find(
                        c => c._id.toString() === action.destination
                      )
                      if (targetScreen) {
                        propsBuilder.push(
                          `navigate.navigate('${targetScreen.name}', {`
                        )
                        if (action.parameters) {
                          if (targetScreen.parameters) {
                            targetScreen.parameters.forEach(p => {
                              const actionParam =
                                action.parameters![p._id.toString()]
                              const targetEntity =
                                projectInfo.appConfig.apiConfig.models.find(
                                  m =>
                                    m._id.toString() === p.entityType.toString()
                                )
                              if (actionParam) {
                                // this only works for ARRAY param props
                                propsBuilder.push(
                                  `${targetEntity?.name}Id: item._id`
                                )
                              }
                            })
                          }
                        }
                        propsBuilder.push(`});`)
                      }
                      break
                    case 'ALERT':
                      if (!importsBuilder['react-native']) {
                        importsBuilder['react-native'] = {}
                      }
                      importsBuilder['react-native'].Alert = 'single'
                      propsBuilder.push(
                        `Alert.alert("${draftJsStuff(
                          action.message,
                          rootComponents,
                          projectInfo,
                          packages
                        )}");`
                      )
                      break
                    case 'LOGIN':
                      if (!importsBuilder['./generated/graphql']) {
                        importsBuilder['./generated/graphql'] = {}
                      }
                      importsBuilder['./generated/graphql'].useLoginMutation =
                        'single'
                      if (!hooksBuilder.useLoginMutation) {
                        hooksBuilder.useLoginMutation = {
                          hook: {
                            type: 'array',
                            value: [],
                          },
                        }
                      }
                      ;(
                        hooksBuilder.useLoginMutation.hook as ArrayHookVariable
                      ).value.push({
                        type: 'variable',
                        value: 'login',
                      })
                      propsBuilder.push(
                        `const success = await login({ variables: { username: \`${draftJsStuff(
                          action.username,
                          rootComponents,
                          projectInfo,
                          packages
                        )}\`, password: \`${draftJsStuff(
                          action.password,
                          rootComponents,
                          projectInfo,
                          packages
                        )}\`}});`
                      )
                      if (action.onSucess) {
                        propsBuilder.push(`if (success.data) {`)
                        if (
                          !importsBuilder[
                            '@react-native-async-storage/async-storage'
                          ]
                        ) {
                          importsBuilder[
                            '@react-native-async-storage/async-storage'
                          ] = {}
                        }
                        importsBuilder[
                          '@react-native-async-storage/async-storage'
                        ].AsyncStorage = 'default'
                        propsBuilder.push(
                          `await AsyncStorage.setItem('authToken', success.data.login);`
                        )
                        action.onSucess.forEach(action => actionBuilder(action))
                        propsBuilder.push(`}`)
                      }
                      if (action.onFail) {
                        propsBuilder.push(`if (success.errors) {`)
                        action.onFail.forEach(action => actionBuilder(action))
                        propsBuilder.push(`}`)
                      }
                      break
                    case 'REGISTER':
                      if (!importsBuilder['./generated/graphql']) {
                        importsBuilder['./generated/graphql'] = {}
                      }
                      importsBuilder[
                        './generated/graphql'
                      ].useRegisterMutation = 'single'
                      if (!hooksBuilder.useRegisterMutation) {
                        hooksBuilder.useRegisterMutation = {
                          hook: {
                            type: 'array',
                            value: [],
                          },
                        }
                      }
                      ;(
                        hooksBuilder.useRegisterMutation
                          .hook as ArrayHookVariable
                      ).value.push({
                        type: 'variable',
                        value: 'register',
                      })

                      const authModel =
                        projectInfo.appConfig.apiConfig.models.find(
                          m =>
                            m._id.toString() ===
                            projectInfo.appConfig.authConfig.tableId.toString()
                        )
                      if (authModel) {
                        const authPartBuilder = [] as string[]
                        authPartBuilder.push(`{ variables: { userData: { `)
                        const authFieldsBuilder = [] as string[]
                        Object.keys(action.fields).forEach(f => {
                          const value = draftJsStuff(
                            action.fields[f],
                            rootComponents,
                            projectInfo,
                            packages
                          )
                          const field = authModel.fields.find(
                            field => field._id.toString() === f
                          )
                          if (field) {
                            authFieldsBuilder.push(
                              ` ${field.fieldName}: \`${value}\``
                            )
                          }
                        })
                        authPartBuilder.push(authFieldsBuilder.join(','))
                        authPartBuilder.push(`} } }`)
                        console.log(authPartBuilder.join(''))
                        propsBuilder.push(
                          `const success = await register(${authPartBuilder.join(
                            ''
                          )});`
                        )
                        if (action.onSucess) {
                          propsBuilder.push(`if (success.data) {`)

                          if (
                            !importsBuilder[
                              '@react-native-async-storage/async-storage'
                            ]
                          ) {
                            importsBuilder[
                              '@react-native-async-storage/async-storage'
                            ] = {}
                          }
                          importsBuilder[
                            '@react-native-async-storage/async-storage'
                          ].AsyncStorage = 'default'
                          propsBuilder.push(
                            `await AsyncStorage.setItem('authToken', success.data.register);`
                          )
                          action.onSucess.forEach(action =>
                            actionBuilder(action)
                          )
                          propsBuilder.push(`}`)
                        }
                        if (action.onFail) {
                          propsBuilder.push(`if (success.errors) {`)
                          action.onFail.forEach(action => actionBuilder(action))
                          propsBuilder.push(`}`)
                        }
                      }
                      break
                    case 'CREATE':
                      // generate graphql file if needed
                      if (action.dataType && action.fields) {
                        const actionFields = action.fields
                        const model =
                          projectInfo.appConfig.apiConfig.models.find(
                            m => m._id.toString() === action.dataType
                          )
                        if (model) {
                          if (!importsBuilder['./generated/graphql']) {
                            importsBuilder['./generated/graphql'] = {}
                          }
                          importsBuilder['./generated/graphql'][
                            `useCreate${model.name}Mutation`
                          ] = 'single'
                          if (!hooksBuilder[`useCreate${model.name}Mutation`]) {
                            hooksBuilder[`useCreate${model.name}Mutation`] = {
                              hook: {
                                type: 'array',
                                value: [],
                              },
                            }
                          }
                          ;(
                            hooksBuilder[`useCreate${model.name}Mutation`]
                              .hook as ArrayHookVariable
                          ).value.push({
                            type: 'variable',
                            value: `create${model.name}`,
                          })
                          const createPartBuilder = [] as string[]
                          createPartBuilder.push(`{ variables: { input: { `)
                          const createFieldsBuilder = [] as string[]
                          Object.keys(actionFields).forEach(f => {
                            const value = draftJsStuff(
                              actionFields[f],
                              rootComponents,
                              projectInfo,
                              packages
                            )
                            const field = model.fields.find(
                              field => field._id.toString() === f
                            )
                            if (field) {
                              // need value cohersion
                              switch (field.dataType) {
                                case 'Boolean':
                                  createFieldsBuilder.push(
                                    ` ${field.fieldName}: ${value}`
                                  )
                                  break
                                default:
                                  createFieldsBuilder.push(
                                    ` ${field.fieldName}: \`${value}\``
                                  )
                                  break
                              }
                            }
                          })
                          createPartBuilder.push(createFieldsBuilder.join(','))
                          createPartBuilder.push(`} } }`)
                          console.log(createPartBuilder.join(''))
                          propsBuilder.push(
                            `const success = await create${
                              model.name
                            }(${createPartBuilder.join('')});`
                          )
                        }
                      }
                      break
                    case 'DELETE':
                      if (action.deleteElement) {
                        // const actionFields = action.fields
                        // const model =
                        //   projectInfo.appConfig.apiConfig.models.find(
                        //     m =>
                        //       m._id.toString() === action.updateElement?.entity
                        //   )
                        // if (model) {
                        //   if (!importsBuilder['./generated/graphql']) {
                        //     importsBuilder['./generated/graphql'] = {}
                        //   }
                        //   importsBuilder['./generated/graphql'][
                        //     `useUpdate${model.name}Mutation`
                        //   ] = 'single'
                        //   if (!hooksBuilder[`useUpdate${model.name}Mutation`]) {
                        //     hooksBuilder[`useUpdate${model.name}Mutation`] = {
                        //       hook: {
                        //         type: 'array',
                        //         value: [],
                        //       },
                        //     }
                        //   }
                        //   ;(
                        //     hooksBuilder[`useUpdate${model.name}Mutation`]
                        //       .hook as ArrayHookVariable
                        //   ).value.push({
                        //     type: 'variable',
                        //     value: `update${model.name}`,
                        //   })
                        //   const updatePartBuilder = [] as string[]
                        //   updatePartBuilder.push(`{ variables: { input: { `)
                        //   const createFieldsBuilder = [] as string[]
                        //   Object.keys(actionFields).forEach(f => {
                        //     const value = draftJsStuff(
                        //       actionFields[f],
                        //       rootComponents,
                        //       projectInfo,
                        //       packages
                        //     )
                        //     const field = model.fields.find(
                        //       field => field._id.toString() === f
                        //     )
                        //     if (field) {
                        //       // need value cohersion
                        //       switch (field.dataType) {
                        //         case 'Boolean':
                        //           if (value) {
                        //             createFieldsBuilder.push(
                        //               ` ${field.fieldName}: !!${value}`
                        //             )
                        //           }
                        //           break
                        //         default:
                        //           if (value) {
                        //             createFieldsBuilder.push(
                        //               ` ${field.fieldName}: \`${value}\``
                        //             )
                        //           }
                        //           break
                        //       }
                        //     }
                        //   })
                        //   updatePartBuilder.push(createFieldsBuilder.join(','))
                        //   updatePartBuilder.push(`}, `)
                        //   updatePartBuilder.push(`condition: {`)
                        //   // TODO: This is the wrong assumption
                        //   updatePartBuilder.push(`_id: item._id`)
                        //   updatePartBuilder.push(`} } }`)
                        //   console.log(updatePartBuilder.join(''))
                        //   propsBuilder.push(
                        //     `const success = await update${
                        //       model.name
                        //     }(${updatePartBuilder.join('')});`
                        //   )
                        // }
                      }
                      break

                    case 'UPDATE':
                      if (action.updateElement && action.fields) {
                        const actionFields = action.fields
                        const model =
                          projectInfo.appConfig.apiConfig.models.find(
                            m =>
                              m._id.toString() === action.updateElement?.entity
                          )
                        if (model) {
                          if (!importsBuilder['./generated/graphql']) {
                            importsBuilder['./generated/graphql'] = {}
                          }
                          importsBuilder['./generated/graphql'][
                            `useUpdate${model.name}Mutation`
                          ] = 'single'
                          if (!hooksBuilder[`useUpdate${model.name}Mutation`]) {
                            hooksBuilder[`useUpdate${model.name}Mutation`] = {
                              hook: {
                                type: 'array',
                                value: [],
                              },
                            }
                          }
                          ;(
                            hooksBuilder[`useUpdate${model.name}Mutation`]
                              .hook as ArrayHookVariable
                          ).value.push({
                            type: 'variable',
                            value: `update${model.name}`,
                          })
                          const updatePartBuilder = [] as string[]
                          updatePartBuilder.push(`{ variables: { input: { `)
                          const createFieldsBuilder = [] as string[]
                          Object.keys(actionFields).forEach(f => {
                            const value = draftJsStuff(
                              actionFields[f],
                              rootComponents,
                              projectInfo,
                              packages
                            )
                            const field = model.fields.find(
                              field => field._id.toString() === f
                            )
                            if (field) {
                              // need value cohersion
                              switch (field.dataType) {
                                case 'Boolean':
                                  if (value) {
                                    createFieldsBuilder.push(
                                      ` ${field.fieldName}: !!${value}`
                                    )
                                  }
                                  break
                                default:
                                  if (value) {
                                    createFieldsBuilder.push(
                                      ` ${field.fieldName}: \`${value}\``
                                    )
                                  }
                                  break
                              }
                            }
                          })
                          updatePartBuilder.push(createFieldsBuilder.join(','))
                          updatePartBuilder.push(`}, `)
                          updatePartBuilder.push(`condition: {`)
                          // TODO: This is the wrong assumption
                          updatePartBuilder.push(`_id: item._id`)
                          updatePartBuilder.push(`} } }`)
                          console.log(updatePartBuilder.join(''))
                          propsBuilder.push(
                            `const success = await update${
                              model.name
                            }(${updatePartBuilder.join('')});`
                          )
                        }
                      }
                      break
                  }
                }
                ;(component.props[prop] as ActionProps[]).forEach(action =>
                  actionBuilder(action)
                )
                propsBuilder.push(`} }`)
                break
              case 'string':
                propsBuilder.push(
                  `${prop}={\`${draftJsStuff(
                    component.props[prop],
                    rootComponents,
                    projectInfo,
                    packages
                  )}\`}`
                )
                break
              case 'object':
                propsBuilder.push(
                  `${prop}={${JSON.stringify(component.props[prop])}}`
                )
                break
              case 'array':
                break
              default:
                // the rest need to be stripped of DraftJS if applicable
                propsBuilder.push(`${prop}={${component.props[prop]}}`)
                break
            }
          }
        })
        if (component.children && component.children.length > 0) {
          propsBuilder.push('>')
          bableBuilder.push(propsBuilder.join(' '))
          component.children.forEach(child =>
            buildChild(child, indentation + 3)
          )
          bableBuilder.push(
            `${''.padStart(indentation, ' ')}</${component.name}>`
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
