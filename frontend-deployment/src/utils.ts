import { Schema, ActionProps } from '@fuchsia/types'
import { ObjectId } from 'mongodb'
import { Component, Package, Project } from './types'
import { RawDraftContentState } from 'draft-js'
import fs, { CopyOptions } from 'fs-extra'
import path from 'path'
export interface Import {
  [packageName: string]: { [componentName: string]: 'default' | 'single' }
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
  [hookName: string]: Hook
}

export const draftJsStuff = (
  value: any,
  project: Component[],
  packages: Package[]
) => {
  if (value.blocks) {
    let textParts = [] as string[]
    const draft = value as RawDraftContentState
    draft.blocks.forEach(block => {
      let currentText = block.text
      ;[...block.entityRanges].reverse().forEach(range => {
        let replacementText = ''
        if (draft.entityMap && draft.entityMap[range.key]) {
          switch (draft.entityMap[range.key].data.type) {
            case 'INPUT':
              const [parts, dataPath] = draft.entityMap[
                range.key
              ].data.entityPath.split('+') as string[]
              const bits = parts.split('.')
              let currentComponent: Component | null = null
              bits.forEach(bit => {
                if (!currentComponent) {
                  const comp = project.find(p => p._id.toString() === bit)
                  if (comp) {
                    currentComponent = comp
                  }
                } else {
                  if (currentComponent.children) {
                    const comp = currentComponent.children.find(
                      p => p._id.toString() === bit
                    )
                    if (comp) {
                      currentComponent = comp
                    }
                  }
                }
              })
              if (currentComponent !== null) {
                replacementText = `\${${(currentComponent as Component).name}${
                  dataPath ? dataPath : ''
                }}`
              }
              break
            case 'LOCAL_DATA':
              if (
                draft.entityMap[range.key].data.entityPath === 'CurrentUser'
              ) {
                replacementText = `\${meData?.me?._id}`
              }
              break
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
    if (hooks[key].type === 'multiple') {
      ;(hooks[key].value as MultipleHookVariable[]).forEach(v => {
        const hookBuilder = [] as string[]
        hookBuilder.push(`const `)
        hookBuilder.push(buildUpHook(v))
        hookBuilder.push(` = ${key}()`)
        hooksBuilder.push(hookBuilder.join(''))
      })
    } else {
      const hookBuilder = [] as string[]
      hookBuilder.push(`const `)
      hookBuilder.push(buildUpHook(hooks[key]))
      hookBuilder.push(` = ${key}()`)
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
  entryComponentId: ObjectId
) {
  const entryComponent = components.find(
    c => c._id.toString() === entryComponentId.toString()
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
  const authTable = projectInfo.appConfig.apiConfig.models.find(
    m =>
      m._id.toString() === projectInfo.appConfig.authConfig.tableId.toString()
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
  }
}

export async function generateEntityModelGraphqlFiles(
  srcdir: string,
  projectInfo: Project
) {
  // this is done from function before, making this error prone if refactored
  // await fs.mkdir(path.join(srcdir, 'graphql'))
  await Promise.all(
    projectInfo.appConfig.apiConfig.models.map(async m => {
      // every model gets a Get, List, Create, Delete, Update

      await fs.writeFile(
        path.join(srcdir, 'graphql', `Get${m.name}.graphql`),
        `
query Get${m.name}($_id: ID!) {
  get${m.name}(_id: $_id) {
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
    ${m.fields
      .filter(f => !f.connection && !f.isHashed)
      .map(f => f.fieldName)
      .join('\n')}
  }
}
      `,
        { flag: 'w' }
      )
    })
  )
}
