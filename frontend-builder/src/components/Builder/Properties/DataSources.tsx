import React, { useState } from 'react'
import {
  GetComponentDocument,
  useAddParameterMutation,
  useGetEntityModelQuery,
  useRemoveParameterMutation,
  useUpdateComponentMutation,
  // useUpdateParameterMutation,
} from '../../../generated/graphql'
import styled from '@emotion/styled'
import { LabeledCheckbox } from '../../Shared/primitives/LabeledCheckbox'
import { useParams } from 'react-router-dom'
import { LabeledSelect } from '../../Shared/primitives/LabeledSelect'
import { OutlinedButton } from '../../Shared/primitives/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import TextInputBinding from '../../Shared/TextInputBinding'
import { gql } from '@apollo/client'

export interface Expression {
  operator: string
  operand?: string
}

export interface PrimitiveFilter {
  key: string
  value: string | boolean | number | Expression
}
export interface NotFilter {
  key: '$not'
  value: Filter
}

export interface AndFilter {
  key: '$and'
  value: Filter[]
}

export interface OrFilter {
  key: '$or'
  value: Filter[]
}

export type Filter = AndFilter | OrFilter | NotFilter | PrimitiveFilter

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
export function FilterSelect({
  fields,
  value,
  onChange,
}: {
  fields: Fields[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <LabeledSelect
      label="Filter"
      onChange={onChange}
      selectedValue={value}
      options={[
        {
          label: 'ID',
          value: '_id',
        },
        ...fields
          .filter(f => !f.isHashed)
          .map(field => ({
            label: field.fieldName,
            value: field._id,
          })),
        {
          label: '$and',
          value: '$and',
        },
        {
          label: '$or',
          value: '$or',
        },
        {
          label: '$not',
          value: '$not',
        },
      ]}
    />
  )
}

const FilterWrapper = styled.div`
  background: var(--canvasBg);
  border: 1px dotted var(--text);
  border-radius: 0.5em;
  padding: 0.5em;
`

export function ModelInputFilter({
  componentId,
  filter,
  fields,
  onChange,
  onDelete,
}: {
  filter: Filter
  fields: Fields[]
  onDelete: () => void
  onChange: (newValue: any) => void
  componentId: string
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
                  componentId={componentId}
                  onChange={value => {
                    const newFilter = { ...filter } as AndFilter
                    newFilter.value[index] = value
                    localChange(newFilter)
                  }}
                  onDelete={() => {
                    const newFilter = { ...filter } as AndFilter
                    newFilter.value.splice(index, 1)
                    localChange(newFilter)
                  }}
                />
              </>
            ))}
            <OutlinedButton
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
            </OutlinedButton>
          </>
        )
      case '$or':
        return (
          <>
            {(filter as OrFilter).value.map((f, index) => (
              <>
                <ModelInputFilter
                  componentId={componentId}
                  filter={f}
                  fields={fields}
                  onChange={value => {
                    const newFilter = { ...filter } as OrFilter
                    newFilter.value[index] = value
                    localChange(newFilter)
                  }}
                  onDelete={() => {
                    const newFilter = { ...filter } as OrFilter
                    newFilter.value.splice(index, 1)
                    localChange(newFilter)
                  }}
                />
              </>
            ))}
            <OutlinedButton
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
            </OutlinedButton>
          </>
        )
      case '$not':
        return (
          <ModelInputFilter
            componentId={componentId}
            filter={(filter as NotFilter).value}
            fields={fields}
            onChange={value => {
              localChange({
                key: filter.key,
                value: value,
              })
            }}
            onDelete={onDelete}
          />
        )
      default:
        return (
          <TextInputBinding
            componentId={componentId}
            initialValue={filter.value as any}
            onChange={value => {
              localChange({
                key: filter.key,
                value,
              })
            }}
          />
        )
    }
  }
  return (
    <FilterWrapper>
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
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
        {getFilterValue(filter)}
      </div>
    </FilterWrapper>
  )
}

export function FilterBuilder({
  componentId,
  entityModelId,
  models,
  filter,
  onDelete,
  onFilterUpdate,
}: {
  componentId: string
  entityModelId: string
  models: Array<{ _id: string; name: string }>
  filter: { type: string; variables: Filter[] }
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
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
      {filter.variables.map((variable, index) => (
        <ModelInputFilter
          componentId={componentId}
          filter={variable}
          fields={entityModelData.getEntityModel!.fields}
          onChange={newValue => {
            const update = { ...filter }
            update.variables = [...update.variables]
            update.variables[index] = newValue
            onFilterUpdate(update)
          }}
          onDelete={() => {
            const newFilter = { ...filter }
            newFilter.variables.splice(index, 1)
            onFilterUpdate(newFilter)
          }}
        />
      ))}
      <OutlinedButton
        onClick={() => {
          onFilterUpdate({
            ...filter,
            variables: [
              ...filter.variables,
              { key: '$and', value: [] as any[] },
            ],
          })
        }}
      >
        Add filter
      </OutlinedButton>
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
  fetched: Array<{ type: string; variables: Filter[] }>
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
          componentId={componentId}
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
      <LabeledSelect
        label="Entity"
        selectedValue={newParameter}
        options={models.map(modelType => ({
          label: modelType.name,
          value: modelType._id,
        }))}
        onChange={e => {
          const type = e.target.value
          setNewParameter(type)
        }}
      />

      <OutlinedButton
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
      </OutlinedButton>
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
  const [addParameter] = useAddParameterMutation({
    refetchQueries: [
      {
        query: gql`
          ${GetComponentDocument}
        `,
        variables: {
          componentId,
        },
      },
    ],
  })
  const [removeParameter] = useRemoveParameterMutation({
    refetchQueries: [
      {
        query: gql`
          ${GetComponentDocument}
        `,
        variables: {
          componentId,
        },
      },
    ],
  })
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
          <IconButton
            onClick={() => {
              removeParameter({
                variables: {
                  componentId,
                  parameterId: param._id,
                },
              })
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <LabeledSelect
        label="Data type"
        selectedValue={newParameter}
        onChange={e => {
          const type = e.target.value
          setNewParameter(type)
        }}
        options={models.map(modelType => ({
          label: modelType.name,
          value: modelType._id,
        }))}
      />
      <OutlinedButton
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
      </OutlinedButton>
    </div>
  )
}

const DataSources = function DataSources({
  componentId,
  component,
  models,
}: {
  componentId: string
  component: any
  models: Array<{ _id: string; name: string }>
}) {
  if (!component) {
    return <div>loading...</div>
  }
  return (
    <div>
      {component.isRootElement && (
        <RootParameterEditor
          models={models}
          componentId={componentId}
          parameters={component.parameters || []}
          fetched={component.fetched || []}
        />
      )}
      {!component.isRootElement && component.isContainer && (
        <ContainerParameterEditor
          models={models}
          componentId={componentId}
          parameters={component.parameters || []}
          fetched={JSON.parse(JSON.stringify(component.fetched || []))}
        />
      )}
    </div>
  )
}

export default DataSources
