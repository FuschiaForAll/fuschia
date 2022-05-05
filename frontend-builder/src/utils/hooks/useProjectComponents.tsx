import { RawDraftContentState } from 'draft-js'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
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
  layout?: { [key: string]: any } | null
  children?: StructuredComponent[]
  parent?: StructuredComponent
  fetched?: Array<{
    entityType: string
    variables: Array<{
      key: string
      value: RawDraftContentState
    }>
  }> | null
  layerSort: string
}

interface IProjectComponentContext {
  structuredComponents: StructuredComponent[]
}

export const ProjectComponentContext = createContext<IProjectComponentContext>({
  structuredComponents: [],
})

export const ProjectComponentProvider = ({
  projectId,
  children,
}: PropsWithChildren<{ projectId: string }>) => {
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

      const rootElements = components.filter(c => !c.parent)
      const remappedEntities = rootElements.map(root => {
        const recursiveChildren = (
          component: Component,
          parent?: StructuredComponent
        ): StructuredComponent => {
          const remappedComponent = { ...component }
          const findChildren = components.filter(
            c => c.parent === component._id
          )
          const newComponent = { ...remappedComponent } as StructuredComponent
          newComponent.children = findChildren
            .map(child => recursiveChildren(child, parent))
            .sort((a, b) => a.layerSort.localeCompare(b.layerSort))
          newComponent.parent = parent
          return newComponent
        }
        const findChildren = components.filter(c => c.parent === root._id)
        const parent = { ...root } as StructuredComponent
        parent.children = findChildren
          .map(child => recursiveChildren(child, parent))
          .sort((a, b) => a.layerSort.localeCompare(b.layerSort))
        return parent
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
  return (
    <ProjectComponentContext.Provider
      value={{
        structuredComponents: structuredComponent,
      }}
    >
      {children}
    </ProjectComponentContext.Provider>
  )
}

export const useProjectComponents = () => {
  return useContext(ProjectComponentContext)
}
