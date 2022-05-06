// get the project structure
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
import { baseApp } from './boilerplate/App'
import { generateServerSchema } from './schema.builder'
import { exec } from 'child_process'
import { apolloClient } from './boilerplate/apollo-client'
import { Component } from '../../Projects/AppConfig/Components/Component.entity'
import { Project } from '../../Projects/Project.entity'
import { Package } from '../../Packages/Package.entity'

const starterdir = path.join(__dirname, './StarterProject')

interface StructuredComponent extends Component {
  children: Component[]
}

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

async function copyStarterToWorkDir(workdir: string) {
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

function buildChildStructure(
  parent: Component,
  depth: number,
  components: StructuredComponent[]
): StructuredComponent {
  if (depth === MAX_DEPTH) {
    throw new Error('Probably recursive component')
  }
  const children = components.filter(c => c.parent && c.parent.toString() === parent._id.toString())
  const branches = children.map(child => buildChildStructure(child, depth + 1, components))
  return {
    ...parent,
    children: branches,
  }
}

async function getProjectStructure(components: Component[], project: Project) {
    // get root components
    const rootElements = components.filter(c => !c.parent)
    // recursively build entiry tree structure
    return rootElements.map(c => buildChildStructure(c, 0, components))
}

function getImports(imports: Import, parent: StructuredComponent) {
  const newImports = { ...imports }
  if (!newImports[parent.package]) {
    newImports[parent.package] = { [parent.type]: 'single' }
  } else {
    newImports[parent.package][parent.type] = 'single'
  }
  if (parent.children) {
    parent.children.forEach(c => getImports(newImports, c as StructuredComponent))
  }
  return newImports
}

async function buildScreen(
  srcdir: string,
  rootComponent: StructuredComponent,
  packages: Package[],
  rootComponents: StructuredComponent[],
  projectInfo: Project
) {
  const hooksBuilder = {} as Hooks
  const importsBuilder = getImports({}, rootComponent)
  importsBuilder.react = {
    React: 'default',
  }
  const functionsBuilder = [] as string[]
  const bableBuilder = [] as string[]

  function buildChild(component: StructuredComponent, indentation: number) {
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
                
                const fetchedModel = projectInfo.serverConfig.apiConfig.models.find(
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
        if (component.props) {
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

        }
        if (component.children && component.children.length > 0) {
          propsBuilder.push('>')
          bableBuilder.push(propsBuilder.join(' '))
          component.children.forEach(child =>
            buildChild(child as StructuredComponent, indentation + 3)
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
    rootComponent.children.forEach(child => buildChild(child as StructuredComponent, 9))
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
      const parameterModel = projectInfo.serverConfig.apiConfig.models.find(
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

export async function CreateProject(project: Project, appComponents: Component[], schema: Package[], version: string) {
  const workdir = path.join('/tmp', `${project._id.toString()}-app`)
  const srcdir = path.join(workdir, 'src')
  fs.rmSync(workdir, { recursive: true, force: true })
  try {
    fs.ensureDir(workdir)
    fs.ensureDir(srcdir)

  } catch {
    throw new Error('happened here')
  }
  if (!project.appConfig.appEntryComponentId) {
    throw new Error('No entry point defined')
  }
  // move starterproject to workdir
  await copyStarterToWorkDir(workdir)
  const structuredAppComponents = await getProjectStructure(appComponents, project)
  // create server schema
  await fs.writeFile(
    path.join(workdir, 'schema.graphql'),
    generateServerSchema(project),
    { flag: 'w' }
  )
  await generateAuthGraphqlFiles(srcdir, project)
  await generateEntityModelGraphqlFiles(srcdir, project)
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
    generateRootNavigator(structuredAppComponents, project.appConfig.appEntryComponentId.toString()),
    { flag: 'w' }
  )
  await fs.writeFile(path.join(srcdir, 'App.tsx'), baseApp)
  await fs.writeFile(path.join(srcdir, 'apollo-client.tsx'), apolloClient)
  await Promise.all(structuredAppComponents.map(component =>
    buildScreen(srcdir, component, schema, structuredAppComponents, project)
  ))
}