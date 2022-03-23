import React, { useState } from 'react'
import {
  GetComponentQuery,
  useAddParameterMutation,
  useGetEntityModelQuery,
  useRemoveParameterMutation,
  useUpdateComponentMutation,
  // useUpdateParameterMutation,
} from '../../../generated/graphql'
import { LabeledCheckbox } from '../../Shared/primitives/LabeledCheckbox'
import { useParams } from 'react-router-dom'

interface PrimitiveFilter {
  key: string
  value: string | boolean | number
}
interface NotFilter {
  key: '$not'
  value: Filter
}

interface AndFilter {
  key: '$and'
  value: Filter[]
}

interface OrFilter {
  key: '$or'
  value: Filter[]
}

type Filter = AndFilter | OrFilter | NotFilter | PrimitiveFilter

interface Fields {
  _id: any
  fieldName: string
  isUnique: boolean
  isHashed: boolean
  isList?: boolean | null | undefined
  connection?: boolean | null | undefined
  nullable: boolean
  dataType: string
}
function FilterSelect({
  fields,
  value,
  onChange,
}: {
  fields: Fields[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <select onChange={onChange}>
      {fields
        .filter(f => !f.connection && !f.isHashed)
        .map(field => (
          <option
            key={field._id}
            value={field._id}
            selected={field.fieldName === value}
          >
            {field.fieldName}
          </option>
        ))}
      <option value="$and" selected={value === '$and'}>
        AND
      </option>
      <option value="$or" selected={value === '$or'}>
        OR
      </option>
      <option value="$not" selected={value === '$not'}>
        NOT
      </option>
    </select>
  )
}

function ModelInputFilter({
  filter,
  fields,
  onChange,
}: {
  filter: Filter
  fields: Fields[]
  onChange: (newValue: any) => void
}) {
  function localChange(newValue: any) {
    onChange({
      ...filter,
      ...newValue,
    })
  }
  function getFilterValue(filter: Filter) {
    switch (filter.key) {
      case '$and':
        return (
          <>
            {(filter as AndFilter).value.map((f, index) => (
              <>
                <ModelInputFilter
                  filter={f}
                  fields={fields}
                  onChange={value => {
                    const newFilter = { ...filter } as AndFilter
                    newFilter.value[index] = value
                    localChange(newFilter)
                  }}
                />
                <button
                  onClick={() => {
                    const newFilter = { ...filter } as AndFilter
                    newFilter.value.splice(index, 1)
                    localChange(newFilter)
                  }}
                >
                  Delete
                </button>
              </>
            ))}
            <button
              onClick={() => {
                const newFilter = (filter as AndFilter).value.concat({
                  key: '$and',
                  value: [],
                })
                localChange({
                  key: filter.key,
                  value: newFilter,
                })
              }}
            >
              Add New
            </button>
          </>
        )
      case '$or':
        return (
          <>
            {(filter as OrFilter).value.map((f, index) => (
              <>
                <ModelInputFilter
                  filter={f}
                  fields={fields}
                  onChange={value => {
                    const newFilter = { ...filter } as OrFilter
                    newFilter.value[index] = value
                    localChange(newFilter)
                  }}
                />

                <button
                  onClick={() => {
                    const newFilter = { ...filter } as OrFilter
                    newFilter.value.splice(index, 1)
                    localChange(newFilter)
                  }}
                >
                  Delete
                </button>
              </>
            ))}
            <button
              onClick={() => {
                const newFilter = (filter as OrFilter).value.concat({
                  key: '$or',
                  value: [],
                })
                localChange({
                  key: filter.key,
                  value: newFilter,
                })
              }}
            >
              Add New
            </button>
          </>
        )
      case '$not':
        return (
          <ModelInputFilter
            filter={(filter as NotFilter).value}
            fields={fields}
            onChange={value => {
              localChange({
                key: filter.key,
                value: value,
              })
            }}
          />
        )
      default:
        return (
          <input
            type="text"
            value={`${filter.value}`}
            onChange={e => {
              localChange({
                key: filter.key,
                value: e.target.value,
              })
            }}
          />
        )
    }
  }
  return (
    <div style={{ border: 'solid 1px black', margin: 5 }}>
      <div>
        <FilterSelect
          fields={fields}
          value={filter.key}
          onChange={e => {
            let value
            if (e.target.value === '$and' || e.target.value === '$or') {
              value = []
            } else if (e.target.value === '$not') {
              value = {}
            } else {
              value = ''
            }
            onChange({ key: e.target.value, value })
          }}
        />
        {getFilterValue(filter)}
      </div>
    </div>
  )
}

function FilterBuilder({
  entityModelId,
  models,
  filter,
  onDelete,
  onFilterUpdate,
}: {
  entityModelId: string
  models: Array<{ _id: string; name: string }>
  filter: { type: string; variables: string[] }
  onDelete: () => {}
  onFilterUpdate: (newFilter: any) => void
}) {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: entityModelData } = useGetEntityModelQuery({
    variables: {
      projectId,
      entityModelId,
    },
  })
  function extractModelName(parameter: string) {
    const model = models.find(model => model._id === parameter)
    if (model) {
      return model.name
    }
    return parameter
  }
  if (!entityModelData || !entityModelData.getEntityModel) {
    return <div>loading...</div>
  }
  return (
    <div>
      <span>{extractModelName(filter.type)}</span>
      <button
        onClick={() => {
          onDelete()
        }}
      >
        X
      </button>
      {filter.variables.map((variable, index) => (
        <ModelInputFilter
          filter={JSON.parse(variable) as Filter}
          fields={entityModelData.getEntityModel!.fields}
          onChange={newValue => {
            const update = { ...filter }
            update.variables = [...update.variables]
            update.variables[index] = JSON.stringify(newValue)
            onFilterUpdate(update)
          }}
        />
      ))}
      <button
        onClick={() => {
          onFilterUpdate({
            ...filter,
            variables: [
              ...filter.variables,
              JSON.stringify({ key: '$and', value: [] }),
            ],
          })
        }}
      >
        Add filter
      </button>
    </div>
  )
}

function ContainerParameterEditor({
  componentId,
  parameters,
  fetched,
  models,
}: {
  componentId: string
  parameters: Array<{ _id: string; entityId: string; name: string }>
  fetched: Array<{ type: string; variables: string[] }>
  models: Array<{ _id: string; name: string }>
}) {
  const [newParameter, setNewParameter] = useState('')
  const [updateComponent] = useUpdateComponentMutation()
  return (
    <div>
      <div style={{ textDecoration: 'underline' }}>Retrieved Data</div>
      {fetched.length === 0 && (
        <div>This container does not have retrieved data</div>
      )}
      {fetched.map((f, index) => (
        <FilterBuilder
          entityModelId={f.type}
          filter={{ ...f }}
          models={models}
          key={index}
          onFilterUpdate={async newFilter => {
            const newFetched = [...fetched]
            newFetched[index] = newFilter

            await updateComponent({
              variables: {
                componentId,
                componentInput: {
                  fetched: newFetched.map(f => ({
                    type: f.type,
                    variables: f.variables,
                  })),
                },
              },
            })
          }}
          onDelete={async () => {
            const newFetched = [...fetched]
            newFetched.splice(index, 1)

            await updateComponent({
              variables: {
                componentId,
                componentInput: {
                  fetched: newFetched.map(f => ({
                    type: f.type,
                    variables: f.variables,
                  })),
                },
              },
            })
          }}
        />
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
                fetched: [
                  ...fetched.map(f => ({
                    type: f.type,
                    variables: f.variables,
                  })),
                  {
                    type: newParameter,
                    variables: [],
                  },
                ],
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
  parameters: Array<{ _id: string; entityId: string; name: string }>
  fetched: Array<{ type: string; variables: string[] }>
  models: Array<{ _id: string; name: string }>
}) {
  const [newParameter, setNewParameter] = useState('')
  const [addParameter] = useAddParameterMutation()
  const [removeParameter] = useRemoveParameterMutation()
  // const [updatedParameter] = useUpdateParameterMutation()

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
          <span>{extractModelName(param.entityId)}</span>
          <button
            onClick={() => {
              removeParameter({
                variables: {
                  componentId,
                  parameterId: param._id,
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
          await addParameter({
            variables: {
              componentId,
              parameterInput: {
                entityId: newParameter,
                name: extractModelName(newParameter),
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
