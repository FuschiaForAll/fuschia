import { RawDraftContentState } from 'draft-js'
import { useEffect, useState } from 'react'
import {
  Component,
  OnComponentChangeDocument,
  OnComponentChangeSubscriptionResult,
  PackageComponentType,
  useGetComponentsQuery,
} from '../../generated/graphql'

export interface StructuredComponent {
  _id: string
  package: string
  type: string
  name: string
  x?: number | null
  y?: number | null
  componentType: PackageComponentType
  requiresAuth?: boolean | null
  parameters?: Array<{
    entityType: string
    path: string
    label: string
    _id: string
  }> | null
  props?: { [key: string]: any } | null
  children?: StructuredComponent[]
  parentId?: string
  fetched?: Array<{
    entityType: string
    path: string
    label: string
    variables: Array<{
      key: string
      value: RawDraftContentState
    }>
  }> | null
  data?: any | null
}

export const useProjectComponents = (
  projectId: string
): StructuredComponent[] => {
  const [structuredComponent, setStructuredComponent] = useState<
    StructuredComponent[]
  >([])
  const { subscribeToMore, data: componentData } = useGetComponentsQuery({
    variables: {
      projectId,
    },
  })
  useEffect(() => {
    if (componentData) {
      const components = componentData.getComponents

      const rootElements = components.filter(
        c => c.componentType === PackageComponentType.Stack
      )
      const remappedEntities = rootElements.map(root => {
        const recursiveChildren = (
          component: Component
        ): StructuredComponent => {
          const remappedComponent = { ...component }
          const findChildren = components.filter(
            c => c.parent === component._id
          )
          return {
            ...remappedComponent,
            // @ts-ignore
            children: findChildren.map(child => recursiveChildren(child)),
          }
        }
        const findChildren = components.filter(c => c.parent === root._id)
        return {
          ...root,
          // @ts-ignore
          children: findChildren.map(child => recursiveChildren(child)),
        }
      }) as StructuredComponent[]
      setStructuredComponent(remappedEntities)
    }
  }, [componentData])
  useEffect(() => {
    subscribeToMore({
      document: OnComponentChangeDocument,
      variables: { projectId },
      updateQuery: (prev, { subscriptionData }) => {
        const subData =
          subscriptionData as unknown as OnComponentChangeSubscriptionResult
        if (subData.data) {
          switch (subData.data.onComponentChange.type) {
            case 'CREATE':
              return {
                ...prev,
                getComponents: prev.getComponents.concat(
                  subData.data.onComponentChange.components
                ),
              }
            case 'UPDATE':
              const newComponents = [...prev.getComponents]
              subData.data.onComponentChange.components.forEach(c => {
                const toupdate = newComponents.findIndex(nc => nc._id === c._id)
                if (toupdate > -1) {
                  newComponents[toupdate] = c
                }
              })
              return {
                ...prev,
                getComponents: newComponents,
              }
            case 'DELETE':
              const data = subData.data
              return {
                ...prev,
                getComponents: prev.getComponents.filter(
                  c => !data.onComponentChange._ids.includes(c._id)
                ),
              }
          }
        }
        return prev
      },
    })
  }, [projectId, subscribeToMore])
  return structuredComponent
}
