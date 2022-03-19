import React, { useState } from 'react'
import {
  GetComponentQuery,
  useUpdateComponentMutation,
} from '../../../generated/graphql'
import { PRIMITIVE_DATA_TYPES } from '@fuchsia/types'
import { LabeledCheckbox } from '../../Shared/primitives/LabeledCheckbox'

function ContainerParameterEditor({
  componentId,
  parameters,
  fetched,
  models,
}: {
  componentId: string
  parameters: string[]
  fetched: Array<{ type: string; variables: string[] }>
  models: Array<{ _id: string; name: string }>
}) {
  const [newParameter, setNewParameter] = useState('')
  const [updateComponent] = useUpdateComponentMutation()

  function extractModelName(parameter: string) {
    const model = models.find(model => model._id === parameter)
    if (model) {
      return model.name
    }
    return parameter
  }
  return (
    <div>
      <div style={{ textDecoration: 'underline' }}>Retrieved Data</div>
      {fetched.length === 0 && (
        <div>This page does not have retrieved data</div>
      )}
      {fetched.map(fetched => (
        <div>
          <span>{extractModelName(fetched.type)}</span>
          <button
            onClick={() => {
              // const newParams = fetched.filter(p => p !== param)
              // updateComponent({
              //   variables: {
              //     componentId,
              //     componentInput: {
              //       parameters: newParams,
              //     },
              //   },
              // })
            }}
          >
            X
          </button>
        </div>
      ))}
      <select
        value={newParameter}
        onChange={e => {
          const type = e.target.value
          setNewParameter(type)
        }}
      >
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
        Add Data
      </button>
    </div>
  )
}

function RootParameterEditor({
  componentId,
  parameters,
  fetched,
  models,
}: {
  componentId: string
  parameters: string[]
  fetched: Array<{ type: string; variables: string[] }>
  models: Array<{ _id: string; name: string }>
}) {
  const [newParameter, setNewParameter] = useState('')
  const [updateComponent] = useUpdateComponentMutation()

  function extractModelName(parameter: string) {
    const model = models.find(model => model._id === parameter)
    if (model) {
      return model.name
    }
    return parameter
  }
  return (
    <div>
      <LabeledCheckbox
        name="authPage"
        label="Logged in users only?"
        checked={true}
        onChange={() => {}}
      />
      <div style={{ textDecoration: 'underline' }}>Required Data</div>
      {parameters.length === 0 && (
        <div>This page does not have required data</div>
      )}
      {parameters.map(param => (
        <div>
          <span>{extractModelName(param)}</span>
          <button
            onClick={() => {
              const newParams = parameters.filter(p => p !== param)
              updateComponent({
                variables: {
                  componentId,
                  componentInput: {
                    parameters: newParams,
                  },
                },
              })
            }}
          >
            X
          </button>
        </div>
      ))}
      <select
        value={newParameter}
        onChange={e => {
          const type = e.target.value
          setNewParameter(type)
        }}
      >
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
        Add Data
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
  if (!componentQuery.getComponent) {
    return <div>loading...</div>
  }
  return (
    <div>
      {componentQuery.getComponent.isRootElement && (
        <RootParameterEditor
          models={models}
          componentId={componentId}
          parameters={componentQuery.getComponent.parameters || []}
          fetched={componentQuery.getComponent.fetched || []}
        />
      )}
      {!componentQuery.getComponent.isRootElement &&
        componentQuery.getComponent.isContainer && (
          <ContainerParameterEditor
            models={models}
            componentId={componentId}
            parameters={componentQuery.getComponent.parameters || []}
            fetched={componentQuery.getComponent.fetched || []}
          />
        )}
    </div>
  )
}

export default DataSources
