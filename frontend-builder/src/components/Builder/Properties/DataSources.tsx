import React, { useState } from 'react'
import {
  GetComponentQuery,
  useUpdateComponentMutation,
} from '../../../generated/graphql'
import { PRIMITIVE_DATA_TYPES } from '@fuchsia/types'

function RootParameterEditor({
  componentId,
  parameters,
  models,
}: {
  componentId: string
  parameters: string[]
  models: Array<{ _id: string; name: string }>
}) {
  const [newParameter, setNewParameter] = useState('')
  const [updateComponent] = useUpdateComponentMutation()
  return (
    <div>
      <div>Logged in users only?</div>
      <div>Required Data</div>
      {parameters.length === 0 && (
        <div>This page does not have required data</div>
      )}
      {parameters.map(param => (
        <div>{param}</div>
      ))}
      <select
        value={newParameter}
        onChange={e => {
          const type = e.target.value
          setNewParameter(type)
        }}
      >
        {PRIMITIVE_DATA_TYPES.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
        {models.map(modelType => (
          <option key={modelType._id} value={modelType._id}>
            {modelType.name}
          </option>
        ))}
      </select>
      <button
        onClick={async () => {
          await updateComponent({
            variables: {
              componentId,
              componentInput: {
                parameters: [...parameters, newParameter],
              },
            },
          })
          setNewParameter('')
        }}
      >
        Add Parameter
      </button>
    </div>
  )
}

const DataSources = function DataSources({
  componentId,
  componentQuery,
  models,
}: {
  componentId: string
  componentQuery: GetComponentQuery
  models: Array<{ _id: string; name: string }>
}) {
  return (
    <div>
      {componentQuery.getComponent?.isRootElement && (
        <RootParameterEditor
          models={models}
          componentId={componentId}
          parameters={componentQuery.getComponent.parameters || []}
        />
      )}
    </div>
  )
}

export default DataSources
