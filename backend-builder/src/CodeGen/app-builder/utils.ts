import { Schema, ActionProps } from '@fuchsia/types'
import { ObjectId } from 'mongodb'
import { RawDraftContentState } from 'draft-js'
import fs, { CopyOptions } from 'fs-extra'
import path from 'path'
import { Component } from '../../Projects/AppConfig/Components/Component.entity'
import { Project } from '../../Projects/Project.entity'
import { Package } from '../../Packages/Package.entity'
import { Container } from "typedi";
import { S3Uploader } from '../../utils/s3-uploader'
export interface Import {
  [packageName: string]: { [componentName: string]: 'default' | 'single' }
}

interface StructuredComponent extends Component {
  children: Component[]
}

export interface HookVariable {
  type: 'variable'
  value: string
  renamed?: string
}

export interface MultipleHookVariable {
  type: 'multiple'
  value: Hook[]
}

export interface DestructedHookVariable {
  type: 'destructed'
  value: { [key: string]: HookVariable }
}

export interface ArrayHookVariable {
  type: 'array'
  value: Hook[]
}

export type Hook =
  | DestructedHookVariable
  | ArrayHookVariable
  | HookVariable
  | MultipleHookVariable

export interface Hooks {
  [hookName: string]: {
    hook: Hook
    parameters?: { variables: { [key: string]: any } }
  }
}

function findNestedComponent(
  componentId: string,
  project: StructuredComponent[]
): StructuredComponent | undefined {
  for (const p of project) {
    if (p._id.toString() === componentId) {
      return p
    } else if (p.children) {
      const nested = findNestedComponent(componentId, p.children as StructuredComponent[])
      if (nested) {
        return nested
      }
    }
  }
}

export type SourceType =
  | 'LOCAL_DATA'
  | 'SERVER_DATA'
  | 'INPUT'
  | 'PRIMITIVE'
  | 'ASSET'
  | 'VARIABLE'

export interface EntityData {
  value: string
  label: string
  type: SourceType
}

export const draftJsStuff = (
  value: any,
  rootComponents: StructuredComponent[],
  projectInfo: Project,
  packages: Package[],
  assetFolder: string
) => {
  if (!value) {
    return ``
  }
  const uploader = Container.get(S3Uploader)
  if (typeof value === 'object') {
    if (value.blocks) {
      let textParts = [] as string[]
      const draft = value as RawDraftContentState
      draft.blocks.forEach(block => {
        let currentText = block.text
        ;[...block.entityRanges].reverse().forEach(range => {
          let replacementText = ''
          if (draft.entityMap && draft.entityMap[range.key]) {
            if (draft.entityMap[range.key].data) {
              const entityData = draft.entityMap[range.key].data as EntityData[]
              const value = entityData.reduce((acc, d) => {
                switch (d.type) {
                }
              }, {} as any)

              switch (entityData[0].type) {
                case 'ASSET':
                  // save the asset into the assets folder
                  break;
                case 'INPUT':
                  const [parts, dataPath] = entityData[
                    entityData.length - 1
                  ].value.split('+') as string[]
                  const bits = parts.split('.')
                  let currentComponent: StructuredComponent | null = null
                  bits.forEach(bit => {
                    if (!currentComponent) {
                      var comp: any;
                      rootComponents.forEach(element => {
                        element.children.forEach(grandChildElement => {
                          if (grandChildElement._id.toString() === bit) {
                            comp = grandChildElement;
                          }
                          grandChildElement.children.forEach(xx => {
                            if (xx._id.toString() === bit) {
                              comp = xx;
                            }
                          })
                        })
                      });
                      if (comp) {
                        currentComponent = comp
                      }
                    } else {
                      if (currentComponent.children) {
                        const comp = currentComponent.children.find(
                          p => p._id.toString() === bit
                        )
                        if (comp) {
                          currentComponent = comp as StructuredComponent
                        }
                      }
                    }
                  })
                  if (currentComponent !== null) {
                    //replacementText = `\${${(currentComponent as Component).name}${dataPath ? dataPath : ''}}`
                    replacementText = (currentComponent as Component).name + (dataPath ? dataPath : '')
                  }
                  break
                case 'LOCAL_DATA':
                  if (entityData[0].value === 'CurrentUser') {
                    replacementText = `\${meData?.me?._id}`
                  }
                  break
                case 'SERVER_DATA':
                  replacementText = entityData[0].value
                  const entityParts = draft.entityMap[
                    range.key
                  ].data as Array<{ label: string, type: SourceType, value: string}>

                  

                  // const component = findNestedComponent(entityParts[0], rootComponents)
                  // if (component) {
                  //   // we are targeting a component, lets find it's type
                  //   const componentPackage = packages.find(
                  //     p => p.packageName === component.package
                  //   )
                  //   if (componentPackage) {
                  //     const componentElement = componentPackage.components.find(
                  //       c => c.name === component.type
                  //     )

                  //     if (componentElement) {
                  //       if (componentElement.schema.type === 'array') {
                  //         // we need to find the field name targeted and prefix with item

                  //         if (component.fetched) {
                  //           component.fetched.forEach(fetched => {
                  //             const fetchedModel =
                  //               projectInfo.appConfig.apiConfig.models.find(
                  //                 m => m._id.toString() === fetched.entityType
                  //               )
                  //             if (fetchedModel) {
                  //               // this only works 1 level down
                  //               const targetField = fetchedModel.fields.find(
                  //                 field =>
                  //                   field._id.toString() === entityParts[1]
                  //               )
                  //               if (targetField) {
                  //                 replacementText = `\${item.${targetField.fieldName}}`
                  //               }
                  //             }
                  //           })
                  //         }
                  //       }
                  //     }
                  //   }
                  // }
                  break
              }
            }
          }
          currentText = `${currentText.slice(
            0,
            range.offset
          )}${replacementText}${currentText.slice(range.offset + range.length)}`
        })
        textParts.push(currentText)
      })
      return textParts.join('\n')
    }
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = draftJsStuff(value[key], rootComponents, projectInfo, packages, assetFolder)
      return acc
    }, {} as any)
  }

  return value
}

export function createFunctions(action: ActionProps) {
  switch (action.type) {
    case 'ALERT':
      break
  }
}

export function convertHooks(hooks: Hooks) {
  const hooksBuilder = [] as string[]
  Object.keys(hooks).forEach(key => {
    function buildUpHook(hook: Hook): string {
      const builder = [] as string[]
      switch (hook.type) {
        case 'array':
          builder.push(`[`)
          builder.push(hook.value.map(h => buildUpHook(h)).join(', '))
          builder.push(`]`)
          break
        case 'destructed':
          builder.push(`{ `)
          builder.push(
            Object.keys(hook.value)
              .map(h => buildUpHook(hook.value[h]))
              .join(', ')
          )
          builder.push(` }`)
          break
        case 'variable':
          builder.push(hook.value)
          if (hook.renamed) {
            builder.push(`: ${hook.renamed}`)
          }
          break
      }
      return builder.join('')
    }
    if (hooks[key].hook.type === 'multiple') {
      ;(hooks[key].hook.value as MultipleHookVariable[]).forEach(v => {
        const hookBuilder = [] as string[]
        hookBuilder.push(`   const `)
        hookBuilder.push(buildUpHook(v))
        hookBuilder.push(` = ${key}(`)
        
        var defaultValSetter = `'`;
        if (hooks[key].parameters !== null && hooks[key].parameters !== undefined) {
          defaultValSetter = ``;
        }
        hookBuilder.push(defaultValSetter);
        if (hooks[key].parameters) {
          const params = hooks[key].parameters!
          hookBuilder.push(`{ variables: {`)
          Object.keys(params.variables).forEach(variable => {
            hookBuilder.push(`${variable}: ${params.variables[variable]}`)
          })
          hookBuilder.push(`}}`)
        }
        hookBuilder.push(defaultValSetter);
        hookBuilder.push(`)`)
        hooksBuilder.push(hookBuilder.join(''))
      })
    } else {
      const hookBuilder = [] as string[]
      hookBuilder.push(`   const `)
      hookBuilder.push(buildUpHook(hooks[key].hook))
      hookBuilder.push(` = ${key}(`)
      if (hooks[key].parameters) {
        const params = hooks[key].parameters!
        hookBuilder.push(`{ variables: {`)
        Object.keys(params.variables).forEach(variable => {
          hookBuilder.push(`${variable}: ${params.variables[variable]}`)
        })
        hookBuilder.push(`}}`)
      }
      hookBuilder.push(`)`)
      hooksBuilder.push(hookBuilder.join(''))
    }
  })
  return hooksBuilder.join('\n')
}

export function convertImports(imports: Import) {
  return Object.keys(imports)
    .map(packageKey => {
      const mainBuilder = []
      const partsBuilder = []
      const defaultsBuilder = []
      const singlesBuilder = []
      const defaults = Object.keys(imports[packageKey])
        .filter(importKey => imports[packageKey][importKey] === 'default')
        .join(', ')
      let rest = Object.keys(imports[packageKey])
        .filter(importKey => imports[packageKey][importKey] !== 'default')
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

export function generateRootNavigator(
  components: Component[],
  entryComponentId: string
) {
  const entryComponent = components.find(
    c => {
      return c._id.toString() === entryComponentId
    }
  )
  if (!entryComponent) {
    throw new Error('No entry component specified!')
  }
  const navigatorBuilder = []
  navigatorBuilder.push(`import React from 'react'`)
  navigatorBuilder.push(
    `import { createStackNavigator } from '@react-navigation/stack'`
  )
  components.forEach(component =>
    navigatorBuilder.push(
      `import { ${component.name} } from './${component.name}'`
    )
  )

  navigatorBuilder.push(`type RootStackNavigator = {`)
  components.forEach(component =>
    navigatorBuilder.push(`   ${component.name}: undefined,`)
  )
  navigatorBuilder.push(`}`)

  navigatorBuilder.push(
    `const Stack = createStackNavigator<RootStackNavigator>();`
  )

  navigatorBuilder.push(`export function RootNavigator() {`)
  navigatorBuilder.push(`   return (`)
  navigatorBuilder.push(
    `      <Stack.Navigator initialRouteName="${entryComponent.name}" screenOptions={{`
  )
  navigatorBuilder.push(`        headerShown: false,`)
  navigatorBuilder.push(`        gestureEnabled: true,`)
  navigatorBuilder.push(`        animationEnabled: false,`)
  navigatorBuilder.push(`      }}>`)
  components.forEach(component =>
    navigatorBuilder.push(
      `         <Stack.Screen name="${component.name}" component={${component.name}} />`
    )
  )
  navigatorBuilder.push(`      </Stack.Navigator>`)
  navigatorBuilder.push(`   )`)
  navigatorBuilder.push(`}`)

  return navigatorBuilder.join('\n')
}

export async function generateAuthGraphqlFiles(
  srcdir: string,
  projectInfo: Project
) {
  await fs.mkdir(path.join(srcdir, 'graphql'))

  fs.writeFile(
    path.join(srcdir, 'graphql', 'Login.graphql'),
    `
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password)
}
  `,
    { flag: 'w' }
  )
  const authTable = projectInfo.serverConfig.apiConfig.models.find(
    m =>
      m._id.toString() === projectInfo.serverConfig.authConfig.tableId.toString()
  )
  if (authTable) {
    fs.writeFile(
      path.join(srcdir, 'graphql', 'Register.graphql'),
      `
mutation Register($userData: Create${authTable.name}Input!) {
  register(userData: $userData)
}
      `,
      { flag: 'w' }
    )
    fs.writeFile(
      path.join(srcdir, 'graphql', 'Me.graphql'),
      `
query Me {
  me {
    _id
    ${authTable.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
  }
}
    `,
      { flag: 'w' }
    )
  }
}

export async function generateEntityModelGraphqlFiles(
  srcdir: string,
  projectInfo: Project
) {
  // this is done from function before, making this error prone if refactored
  // await fs.mkdir(path.join(srcdir, 'graphql'))
  await Promise.all(
    projectInfo.serverConfig.apiConfig.models.map(async m => {
      // every model gets a Get, List, Create, Delete, Update

      await fs.writeFile(
        path.join(srcdir, 'graphql', `Get${m.name}.graphql`),
        `
query Get${m.name}($_id: ID!) {
  get${m.name}(_id: $_id) {
    _id
    ${m.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
  }
}
      `,
        { flag: 'w' }
      )

      await fs.writeFile(
        path.join(srcdir, 'graphql', `List${m.name}.graphql`),
        `
query List${m.name}($filter: Model${
          m.name
        }FilterInput, $sortDirection: ModelSortDirection, $limit: Int, $nextToken: String) {
  list${
    m.name
  }(filter: $filter, sortDirection: $sortDirection, limit: $limit, nextToken: $nextToken) {
    nextToken
    items {
      _id
    ${m.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
    }
  }
}
      `,
        { flag: 'w' }
      )

      await fs.writeFile(
        path.join(srcdir, 'graphql', `Create${m.name}.graphql`),
        `
mutation Create${m.name}($input: Create${m.name}Input!, $condition: Model${
          m.name
        }ConditionalInput) {
  create${m.name}(input: $input, condition: $condition) {
    _id
    ${m.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
  }
}
      `,
        { flag: 'w' }
      )
      await fs.writeFile(
        path.join(srcdir, 'graphql', `Delete${m.name}.graphql`),
        `
mutation Delete${m.name}($input: Delete${m.name}Input!, $condition: Model${
          m.name
        }ConditionalInput) {
  delete${m.name}(input: $input, condition: $condition) {
    _id
    ${m.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
  }
}
      `,
        { flag: 'w' }
      )
      await fs.writeFile(
        path.join(srcdir, 'graphql', `Update${m.name}.graphql`),
        `
mutation Update${m.name}($input: Update${m.name}Input!, $condition: Model${
          m.name
        }ConditionalInput) {
  update${m.name}(input: $input, condition: $condition) {
    _id
    ${m.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
  }
}
      `,
        { flag: 'w' }
      )
      await fs.writeFile(
        path.join(srcdir, 'graphql', `On${m.name}Change.graphql`),
        `
subscription On${m.name}Change($filter: Model${m.name}FilterInput) {
  on${m.name}Change(filter: $filter) {
    type
    _ids
    items {
      ${m.fields
        .filter(f => !f.connection && !f.isHashed)
        .map(f => f.fieldName)
        .join('\n')}
    }
  }
}
      `,
        { flag: 'w' }
      )
    })
  )
}

export function functionBuilder(
  action: ActionProps,
  importsBuilder: {
    [x: string]: {
      [componentName: string]: 'default' | 'single'
    }
  },
  hooksBuilder: Hooks,
  rootComponents: StructuredComponent[],
  propsBuilder: string[],
  projectInfo: Project,
  packages: Package[],
  assetFolder: string
) {
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
        propsBuilder.push(`navigate.navigate('${targetScreen.name}', {`)
        if (action.parameters) {
          if (targetScreen.parameters) {
            targetScreen.parameters.forEach(p => {
              if (p._id) {
                const actionParam = action.parameters![p._id.toString()]
                const targetEntity = projectInfo.serverConfig.apiConfig.models.find(
                  m => m._id.toString() === p.entityType.toString()
                )
                if (actionParam) {
                  // this only works for ARRAY param props
                  propsBuilder.push(`${targetEntity?.name}Id: item._id`)
                }
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
          packages,
          assetFolder
        )}");`
      )
      break
    case 'LOGIN':
      if (!importsBuilder['./generated/graphql']) {
        importsBuilder['./generated/graphql'] = {}
      }
      importsBuilder['./generated/graphql'].useLoginMutation = 'single'
      if (!hooksBuilder.useLoginMutation) {
        hooksBuilder.useLoginMutation = {
          hook: {
            type: 'array',
            value: [],
          },
        }
      }
      ;(hooksBuilder.useLoginMutation.hook as ArrayHookVariable).value.push({
        type: 'variable',
        value: 'login',
      })
      propsBuilder.push(
        `const success = await login({ variables: { username: ${draftJsStuff(
          action.username,
          rootComponents,
          projectInfo,
          packages,
          assetFolder
        )}, password: ${draftJsStuff(
          action.password,
          rootComponents,
          projectInfo,
          packages,
          assetFolder
        )}}});`
      )
      if (action.onSucess) {
        propsBuilder.push(`if (success.data) {`)
        if (!importsBuilder['@react-native-async-storage/async-storage']) {
          importsBuilder['@react-native-async-storage/async-storage'] = {}
        }
        importsBuilder[
          '@react-native-async-storage/async-storage'
        ].AsyncStorage = 'default'
        propsBuilder.push(
          `await AsyncStorage.setItem('authToken', success.data.login);`
        )
        action.onSucess.forEach(action =>
          functionBuilder(
            action,
            importsBuilder,
            hooksBuilder,
            rootComponents,
            propsBuilder,
            projectInfo,
            packages,
            assetFolder
          )
        )
        propsBuilder.push(`}`)
      }
      if (action.onFail) {
        propsBuilder.push(`if (success.errors) {`)
        action.onFail.forEach(action =>
          functionBuilder(
            action,
            importsBuilder,
            hooksBuilder,
            rootComponents,
            propsBuilder,
            projectInfo,
            packages,
            assetFolder
          )
        )
        propsBuilder.push(`}`)
      }
      break
    case 'REGISTER':
      if (!importsBuilder['./generated/graphql']) {
        importsBuilder['./generated/graphql'] = {}
      }
      importsBuilder['./generated/graphql'].useRegisterMutation = 'single'
      if (!hooksBuilder.useRegisterMutation) {
        hooksBuilder.useRegisterMutation = {
          hook: {
            type: 'array',
            value: [],
          },
        }
      }
      ;(hooksBuilder.useRegisterMutation.hook as ArrayHookVariable).value.push({
        type: 'variable',
        value: 'register',
      })

      const authModel = projectInfo.serverConfig.apiConfig.models.find(
        m =>
          m._id.toString() ===
          projectInfo.serverConfig.authConfig.tableId.toString()
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
            packages,
            assetFolder
          )
          const field = authModel.fields.find(
            field => field._id.toString() === f
          )
          if (field) {
            authFieldsBuilder.push(` ${field.fieldName}: \`${value}\``)
          }
        })
        authPartBuilder.push(authFieldsBuilder.join(','))
        authPartBuilder.push(`} } }`)
        propsBuilder.push(
          `const success = await register(${authPartBuilder.join('')});`
        )
        if (action.onSucess) {
          propsBuilder.push(`if (success.data) {`)

          if (!importsBuilder['@react-native-async-storage/async-storage']) {
            importsBuilder['@react-native-async-storage/async-storage'] = {}
          }
          importsBuilder[
            '@react-native-async-storage/async-storage'
          ].AsyncStorage = 'default'
          propsBuilder.push(
            `await AsyncStorage.setItem('authToken', success.data.register);`
          )
          action.onSucess.forEach(action =>
            functionBuilder(
              action,
              importsBuilder,
              hooksBuilder,
              rootComponents,
              propsBuilder,
              projectInfo,
              packages,
              assetFolder
            )
          )
          propsBuilder.push(`}`)
        }
        if (action.onFail) {
          propsBuilder.push(`if (success.errors) {`)
          action.onFail.forEach(action =>
            functionBuilder(
              action,
              importsBuilder,
              hooksBuilder,
              rootComponents,
              propsBuilder,
              projectInfo,
              packages,
              assetFolder
            )
          )
          propsBuilder.push(`}`)
        }
      }
      break
    case 'CREATE':
      // generate graphql file if needed
      if (action.dataType && action.fields) {
        const actionFields = action.fields
        const model = projectInfo.serverConfig.apiConfig.models.find(
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
              packages,
              assetFolder
            )
            const field = model.fields.find(field => field._id.toString() === f)
            if (field) {
              // need value cohersion
              switch (field.dataType) {
                case 'Boolean':
                  createFieldsBuilder.push(` ${field.fieldName}: ${value}`)
                  break
                default:
                  createFieldsBuilder.push(` ${field.fieldName}: \`${value}\``)
                  break
              }
            }
          })
          createPartBuilder.push(createFieldsBuilder.join(','))
          createPartBuilder.push(`} } }`)
          propsBuilder.push(
            `const success = await create${model.name}(${createPartBuilder.join(
              ''
            )});`
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
        const model = projectInfo.serverConfig.apiConfig.models.find(
          m => m._id.toString() === action.updateElement?.entity
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
              packages,
              assetFolder
            )
            const field = model.fields.find(field => field._id.toString() === f)
            if (field) {
              // need value cohersion
              switch (field.dataType) {
                case 'Boolean':
                  if (value) {
                    createFieldsBuilder.push(` ${field.fieldName}: !!${value}`)
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
          propsBuilder.push(
            `const success = await update${model.name}(${updatePartBuilder.join(
              ''
            )});`
          )
        }
      }
      break
  }
}
