import React, { useCallback, useEffect, useState } from 'react'
import { Props, FunctionSchema } from '@fuchsia/types'
import { useParams } from 'react-router-dom'
import {
  useGetComponentsQuery,
  useGetDataContextQuery,
  useGetProjectQuery,
} from '../../../../generated/graphql'
import DataBinder, { DataStructure, MenuStructure } from './DataBinder'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'

export type FunctionEditorProps = Props<FunctionSchema, any>

const FUNCTION_TYPES = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'NAVIGATE',
  'LOGIN',
  'LOGOUT',
]

type ComponentId = string
type EntityId = string
type RecordId = string

interface LoginProps {
  type: 'LOGIN'
  username: string
  password: string
}

interface NavigateProps {
  type: 'NAVIGATE'
  destination: ComponentId
  parameters: { [targetParameterId: string]: { path: string; label: string } }
}

interface CreateProps {
  type: 'CREATE'
  dataType: EntityId
  fields: { [key: string]: string | number | boolean }
}

interface DeleteProps {
  type: 'DELETE'
  dataType: EntityId
  deleteId: RecordId
}

interface UpdateProps {
  type: 'UPDATE'
  dataType: EntityId
  updateId: RecordId
  fields: { [key: string]: string | number | boolean }
}

type ActionProps =
  | NavigateProps
  | CreateProps
  | DeleteProps
  | UpdateProps
  | LoginProps

const LoginEditor = (props: {
  componentId: string
  params: LoginProps
  onUpdate: (newValue: LoginProps) => void
}) => {
  return (
    <div>
      <LabeledTextInput
        label="Username"
        value={props.params.username}
        onChange={e => {
          const newParams = { ...props.params }
          newParams.username = e.target.value
          props.onUpdate(newParams)
        }}
      />
      <LabeledTextInput
        label="Password"
        value={props.params.password}
        onChange={e => {
          const newParams = { ...props.params }
          newParams.password = e.target.value
          props.onUpdate(newParams)
        }}
      />
    </div>
  )
}

const CreateEditor = (props: {
  componentId: string
  params: CreateProps
  onUpdate: (newValue: CreateProps) => void
}) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { data } = useGetProjectQuery({
    variables: { projectId },
  })
  if (!data || !data.getProject.appConfig) {
    return <div>loading...</div>
  }
  const models = data.getProject.appConfig.apiConfig.models
  return (
    <div>
      <select
        onChange={e => {
          const newParams = { ...props.params }
          newParams.dataType = e.target.value
          const model = models.find(model => model._id === newParams.dataType)
          if (model) {
            newParams.fields = model.fields.reduce(
              (acc, f) => {
                acc[f._id] = ''
                return acc
              },
              {} as {
                [key: string]: string | number | boolean
              }
            )
            props.onUpdate(newParams)
          }
        }}
        value={props.params.dataType}
      >
        {models.map(model => (
          <option
            value={model._id}
            selected={props.params.dataType === model._id}
          >
            {model.name}
          </option>
        ))}
      </select>
      {props.params &&
        props.params.fields &&
        Object.keys(props.params.fields).map(f => {
          const model = models.find(
            model => model._id === props.params.dataType
          )
          if (model) {
            const field = model.fields.find(field => field._id === f)
            if (field) {
              return (
                <LabeledTextInput
                  style={{
                    borderColor:
                      field.nullable || !!field.connection ? 'black' : 'red',
                  }}
                  label={field.fieldName}
                  value={`${props.params.fields[f]}`}
                  onChange={e => {
                    const newProps = { ...props.params }
                    newProps.fields[f] = e.target.value
                    props.onUpdate(newProps)
                  }}
                />
              )
            }
          }
          return null
        })}
    </div>
  )
}
const UpdateEditor = (props: {
  componentId: string
  params: UpdateProps
  onUpdate: (newValue: UpdateProps) => void
}) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { data } = useGetProjectQuery({
    variables: { projectId },
  })
  if (!data || !data.getProject.appConfig) {
    return <div>loading...</div>
  }
  const models = data.getProject.appConfig.apiConfig.models
  return (
    <div>
      <select
        onChange={e => {
          const newParams = { ...props.params }
          newParams.dataType = e.target.value
          const model = models.find(model => model._id === newParams.dataType)
          if (model) {
            newParams.fields = model.fields.reduce(
              (acc, f) => {
                acc[f._id] = ''
                return acc
              },
              {} as {
                [key: string]: string | number | boolean
              }
            )
            props.onUpdate(newParams)
          }
        }}
        value={props.params.dataType}
      >
        {models.map(model => (
          <option
            value={model._id}
            selected={props.params.dataType === model._id}
          >
            {model.name}
          </option>
        ))}
      </select>
      {props.params &&
        props.params.fields &&
        Object.keys(props.params.fields).map(f => {
          const model = models.find(
            model => model._id === props.params.dataType
          )
          if (model) {
            const field = model.fields.find(field => field._id === f)
            if (field) {
              return (
                <LabeledTextInput
                  style={{
                    borderColor:
                      field.nullable || !!field.connection ? 'black' : 'red',
                  }}
                  label={field.fieldName}
                  value={`${props.params.fields[f]}`}
                  onChange={e => {
                    const newProps = { ...props.params }
                    newProps.fields[f] = e.target.value
                    props.onUpdate(newProps)
                  }}
                />
              )
            }
          }
          return null
        })}
    </div>
  )
}
const DeleteEditor = (props: {
  componentId: string
  params: DeleteProps
  onUpdate: (newValue: DeleteProps) => void
}) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { data } = useGetProjectQuery({
    variables: { projectId },
  })
  if (!data || !data.getProject.appConfig) {
    return <div>loading...</div>
  }
  const models = data.getProject.appConfig.apiConfig.models
  return (
    <div>
      <select
        onChange={e => {
          const newParams = { ...props.params }
          newParams.dataType = e.target.value
          props.onUpdate(newParams)
        }}
        value={props.params.dataType}
      >
        {models.map(model => (
          <option
            value={model._id}
            selected={props.params.dataType === model._id}
          >
            {model.name}
          </option>
        ))}
      </select>
      <LabeledTextInput
        label={'Record Id'}
        value={props.params.deleteId}
        onChange={e => {
          const newProps = { ...props.params }
          newProps.deleteId = e.target.value
          props.onUpdate(newProps)
        }}
      />
    </div>
  )
}
const NavigateEditor = ({
  componentId,
  params,
  onUpdate,
}: {
  componentId: string
  params: NavigateProps
  onUpdate: (newValue: NavigateProps) => void
}) => {
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
  const [navTargets, setNagTargets] = useState<
    Array<{
      name: string
      _id: string
      parameters?: Array<{ _id: string; entityId: string; name: string }> | null
    }>
  >([])
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
                  dataType: field.dataType,
                  hasSubMenu: !!field.connection,
                  key: field._id,
                  name: field.fieldName,
                })),
            }
            return acc
          },
          {} as {
            [key: string]: DataStructure
          }
        )
      debugger
      setModelStructures(modelStruct || {})

      const structure = dataContextData.getDataContext.reduce((acc, item) => {
        item.dataSources.forEach(source => {
          const [name, hasSubMenu] = extractModelName(source)
          acc.push({
            source: item.componentId,
            entity: source,
            label: `${item.name}'s ${name}`,
            hasSubMenu,
          })
        })
        return acc
      }, [] as MenuStructure[])
      setDataStructure(structure)
    }
  }, [dataContextData, extractModelName, projectData])
  const buildParameters = () => {
    const target = navTargets.find(t => t._id === params.destination)
    if (target) {
      if (target.parameters && target.parameters.length > 0) {
        return target.parameters.map(p => (
          <>
            <div>{extractModelName(p.entityId)}</div>
            <div style={{ border: 'solid 1px var(--accent)', borderRadius: 5 }}>
              <DataBinder
                targetType={p.entityId}
                onSelect={(entityId, label) => {
                  debugger
                  onUpdate({
                    ...params,
                    parameters: {
                      ...params.parameters,
                      [p._id]: {
                        path: entityId,
                        label,
                      },
                    },
                  })
                }}
                entry={dataStructure}
                dataStructure={modelStructures}
              />
              <span>
                {params.parameters &&
                  params.parameters[p._id]?.label.split('.').pop()}
              </span>
            </div>
          </>
        ))
      } else {
        return <div>No parameters</div>
      }
    }
    return null
  }
  useEffect(() => {
    if (componentData) {
      setNagTargets(componentData.getComponents.filter(c => c.isRootElement))
    }
  }, [componentData])
  return (
    <div>
      <select
        onChange={e => {
          const newScreen = e.target.value
          onUpdate({
            ...params,
            destination: newScreen,
          })
        }}
      >
        {navTargets.map(t => (
          <option value={t._id}>{t.name}</option>
        ))}
      </select>
      {buildParameters()}
    </div>
  )
}

const FunctionEditor = function FunctionEditor(props: FunctionEditorProps) {
  const [functions, setFunctions] = useState<ActionProps[]>([])
  const editor = (
    actionProps: ActionProps,
    onUpdate: (newValue: any) => void
  ) => {
    switch (actionProps.type) {
      case 'CREATE':
        return (
          <CreateEditor
            componentId={props.componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'UPDATE':
        return (
          <UpdateEditor
            componentId={props.componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'DELETE':
        return (
          <DeleteEditor
            componentId={props.componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'NAVIGATE':
        return (
          <NavigateEditor
            componentId={props.componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'LOGIN':
        return (
          <LoginEditor
            componentId={props.componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      default:
        return null
    }
  }
  useEffect(() => {
    let initialValue: ActionProps[]
    if (props.initialValue) {
      initialValue = JSON.parse(props.initialValue) as ActionProps[]
    } else {
      initialValue = []
    }
    setFunctions(initialValue)
  }, [props.initialValue])
  return (
    <div>
      <span>{props.schema.title || 'undefined'}</span>
      {functions.map((f, index) => (
        <>
          <select
            onChange={e => {
              const newFunctions = [...functions]
              // @ts-ignore
              newFunctions[index] = { type: e.target.value }
              props.updateValue(JSON.stringify(newFunctions), true)
            }}
          >
            {FUNCTION_TYPES.map(t => (
              <option value={t} key={t} selected={f.type === t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const newFunctions = [...functions]
              newFunctions.splice(index, 1)
              props.updateValue(JSON.stringify(newFunctions), true)
            }}
          >
            X
          </button>
          {editor(f, newValue => {
            debugger
            setFunctions(fs => {
              fs[index] = newValue
              return [...fs]
            })
            props.updateValue(JSON.stringify(functions), true)
          })}
        </>
      ))}
      <button
        onClick={() => {
          props.updateValue(
            JSON.stringify([...functions, { type: 'CREATE' }]),
            true
          )
        }}
      >
        Add Function
      </button>
    </div>
  )
}

export default FunctionEditor
