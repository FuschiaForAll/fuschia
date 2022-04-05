import { Schema, ActionProps } from '@fuchsia/types'
import { ObjectId } from 'mongodb'
import { Component, Package } from './types'
import { RawDraftContentState } from 'draft-js'
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
              console.log(`GETTING INPUT`)
              const [parts, dataPath] = draft.entityMap[
                range.key
              ].data.entityPath.split('+') as string[]
              console.log(`parts`)
              console.log(parts)
              console.log(`dataPath`)
              console.log(dataPath)
              const bits = parts.split('.')
              let currentComponent: Component | null = null
              bits.forEach(bit => {
                console.log(`bit`)
                console.log(bit)
                console.log(`currentComponent`)
                console.log(currentComponent)
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
                    console.log(`CHILDREN COMP`)
                    console.log(comp)
                    if (comp) {
                      currentComponent = comp
                    }
                  }
                }
              })
              console.log(`HERE HERE HERE`)
              console.log(currentComponent)
              if (currentComponent !== null) {
                replacementText = `\${${(currentComponent as Component).name}${
                  dataPath ? dataPath : ''
                }}`
                console.log(replacementText)
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
