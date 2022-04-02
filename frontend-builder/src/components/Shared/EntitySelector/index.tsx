import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useGetProjectQuery,
  useGetDataContextQuery,
  useGetComponentsQuery,
} from '../../../generated/graphql'
import DataBinder from '../../Builder/Properties/Editors/DataBinder'
import { DataStructure, MenuStructure } from '../CascadingMenu'

export function EntitySelector({
  additionalEntities,
  entityId,
  componentId,
  selectedLabel,
  onSelect,
}: {
  additionalEntities?: MenuStructure[]
  entityId?: string
  componentId: string
  selectedLabel?: string
  onSelect: (entity: string, path: string, label: string) => void
}) {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: projectData } = useGetProjectQuery({
    variables: { projectId },
  })
  const { data: dataContextData } = useGetDataContextQuery({
    variables: {
      componentId,
    },
  })
  const { data: componentData } = useGetComponentsQuery({
    variables: {
      projectId,
    },
  })
  const [modelStructures, setModelStructures] = useState<{
    [key: string]: DataStructure
  }>({})
  const [dataStructure, setDataStructure] = useState<MenuStructure[]>([])
  const extractModelName = useCallback(
    (parameter: string): [string, boolean] => {
      const models = projectData?.getProject.appConfig.apiConfig.models || []
      const model = models.find(model => model._id === parameter)
      if (model) {
        return [model.name, true]
      }
      return [parameter, false]
    },
    [projectData]
  )
  useEffect(() => {
    if (dataContextData) {
      const modelStruct =
        projectData?.getProject.appConfig.apiConfig.models.reduce(
          (acc, item) => {
            acc[item._id] = {
              _id: item._id,
              name: item.name,
              fields: item.fields
                .filter(field => !field.isList) // don't add lists for now
                .map(field => ({
                  type: 'SERVER_DATA',
                  entity: field.dataType,
                  hasSubMenu: !!field.connection,
                  source: field._id,
                  label: field.fieldName,
                })),
            }
            return acc
          },
          {} as {
            [key: string]: DataStructure
          }
        )
      setModelStructures(modelStruct || {})

      const structure = dataContextData.getDataContext.reduce((acc, item) => {
        item.dataSources.forEach(source => {
          const [name, hasSubMenu] = extractModelName(source)
          acc.push({
            type: 'SERVER_DATA',
            source: item.componentId,
            entity: source,
            label: `${item.name}'s ${name}`,
            hasSubMenu,
          })
        })
        return acc
      }, [] as MenuStructure[])
      if (projectData?.getProject.appConfig.authConfig.tableId) {
        structure.push({
          type: 'LOCAL_DATA',
          label: 'Current User',
          hasSubMenu: true,
          entity: projectData?.getProject.appConfig.authConfig.tableId,
          source: 'CurrentUser',
        })
      }
      setDataStructure([...(additionalEntities || []), ...structure])
    }
  }, [additionalEntities, dataContextData, extractModelName, projectData])
  return (
    <>
      <div>{entityId && extractModelName(entityId)}</div>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          border: 'solid 1px var(--accent)',
          borderRadius: 5,
          justifyContent: 'start',
          alignItems: 'center',
        }}
      >
        <DataBinder
          targetType={entityId}
          onSelect={onSelect}
          entry={dataStructure}
          dataStructure={modelStructures}
        />
        <span title={selectedLabel && selectedLabel.split('.').join(' > ')}>
          {selectedLabel && selectedLabel.split('.').pop()}
        </span>
      </div>
    </>
  )
}
