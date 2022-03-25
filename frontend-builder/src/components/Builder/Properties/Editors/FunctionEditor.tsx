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
import TextInputBinding from '../../../Shared/TextInputBinding'
import { OutlinedButton } from '../../../Shared/primitives/Button'
import styled from '@emotion/styled'
import { LabeledSelect } from '../../../Shared/primitives/LabeledSelect'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export type FunctionEditorProps = Props<FunctionSchema, any>

const FUNCTION_TYPES = [
  { label: 'Create a record...', value: 'CREATE' },
  { label: 'Update a record...', value: 'UPDATE' },
  { label: 'Delete a record...', value: 'DELETE' },
  { label: 'Navigate to a screen...', value: 'NAVIGATE' },
  { label: 'Login a user...', value: 'LOGIN' },
  { label: 'Register a user...', value: 'REGISTER' },
  { label: 'Forgot password...', value: 'PASSWORD_RECOVERY' },
  { label: 'Logout the user ....', value: 'LOGOUT' },
  { label: 'Display alert...', value: 'ALERT' },
  { label: 'Change an input...', value: 'CHANGE_INPUT' },
]

type ComponentId = string
type EntityId = string
type RecordId = string

interface LoginProps {
  type: 'LOGIN'
  username: string
  password: string
  onSucess: () => void
  onFail: () => void
}

interface RegistrationProps {
  type: 'REGISTER'
  onSucess: () => void
  onFail: () => void
}
interface ChangeInputProps {
  type: 'CHANGE_INPUT'
  onSucess: () => void
  onFail: () => void
}

interface PasswordRecoveryProps {
  type: 'PASSWORD_RECOVERY'
  message: string
}

interface AlertProps {
  type: 'ALERT'
  message: string
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
  onSucess: () => void
  onFail: () => void
}

interface DeleteProps {
  type: 'DELETE'
  dataType: EntityId
  deleteId: RecordId
  onSucess: () => void
  onFail: () => void
}

interface UpdateProps {
  type: 'UPDATE'
  dataType: EntityId
  updateId: RecordId
  fields: { [key: string]: string | number | boolean }
  onSucess: () => void
  onFail: () => void
}

export type ActionProps =
  | NavigateProps
  | CreateProps
  | DeleteProps
  | UpdateProps
  | LoginProps
  | AlertProps
  | RegistrationProps
  | PasswordRecoveryProps
  | ChangeInputProps

const FunctionWrapper = styled.div`
  background: var(--canvasBg);
  border: 1px dotted var(--text);
  border-radius: 0.5em;
  padding: 0.5em;
`

const ActionWrapper = styled.div`
  &:not(:last-child) {
    border-bottom: dashed 1px black;
    padding-bottom: 0.5em;
  }
`

const LoginEditor = (props: {
  componentId: string
  params: LoginProps
  onUpdate: (newValue: LoginProps) => void
}) => {
  return (
    <div>
      <div style={{ fontSize: '0.75rem' }}>Username</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={props.params.username}
        onChange={value => {
          const newParams = { ...props.params }
          newParams.username = value
          props.onUpdate(newParams)
        }}
      />
      <div style={{ fontSize: '0.75rem' }}>Password</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={props.params.password}
        onChange={value => {
          const newParams = { ...props.params }
          newParams.password = value
          props.onUpdate(newParams)
        }}
      />
      <ConfigureFunction
        title="On Success"
        componentId={props.componentId}
        value={props.params.onSucess}
        updateValue={value => {
          props.onUpdate({
            ...props.params,
            onSucess: value,
          })
        }}
      />
      <ConfigureFunction
        title="On Failure"
        componentId={props.componentId}
        value={props.params.onFail}
        updateValue={value => {
          props.onUpdate({
            ...props.params,
            onFail: value,
          })
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
      <LabeledSelect
        label="Record type"
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
        selectedValue={props.params.dataType}
        options={models.map(model => ({
          label: model.name,
          value: model._id,
        }))}
      />
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
                <React.Fragment key={field._id}>
                  <div>
                    {field.fieldName}{' '}
                    {field.nullable || !!field.connection ? '' : '(required)'}
                  </div>
                  <TextInputBinding
                    componentId={props.componentId}
                    initialValue={`${props.params.fields[f]}`}
                    onChange={value => {
                      const newProps = { ...props.params }
                      newProps.fields[f] = value
                      props.onUpdate(newProps)
                    }}
                  />
                </React.Fragment>
              )
            }
          }
          return null
        })}
      <ConfigureFunction
        title="On Success"
        componentId={props.componentId}
        value={props.params.onSucess}
        updateValue={value => {
          props.onUpdate({
            ...props.params,
            onSucess: value,
          })
        }}
      />
      <ConfigureFunction
        title="On Failure"
        componentId={props.componentId}
        value={props.params.onFail}
        updateValue={value => {
          props.onUpdate({
            ...props.params,
            onFail: value,
          })
        }}
      />
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
      <LabeledSelect
        label="Record to update"
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
        selectedValue={props.params.dataType}
        options={models.map(model => ({
          label: model.name,
          value: model._id,
        }))}
      />
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
const ForgotPasswordEditor = (props: {
  componentId: string
  params: PasswordRecoveryProps
  onUpdate: (newValue: PasswordRecoveryProps) => void
}) => {
  return (
    <div>
      <div>Message</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={props.params.message}
        onChange={value => {
          const newParams = { ...props.params }
          newParams.message = value
          props.onUpdate(newParams)
        }}
      />
    </div>
  )
}
const ChangeInputEditor = (props: {
  componentId: string
  params: ChangeInputProps
  onUpdate: (newValue: ChangeInputProps) => void
}) => {
  return (
    <div>
      <div>Chane Input</div>
    </div>
  )
}
const RegisterEditor = (props: {
  componentId: string
  params: RegistrationProps
  onUpdate: (newValue: RegistrationProps) => void
}) => {
  return (
    <div>
      <div>Register</div>
    </div>
  )
}
const AlertEditor = (props: {
  componentId: string
  params: AlertProps
  onUpdate: (newValue: AlertProps) => void
}) => {
  return (
    <div>
      <div>Message</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={props.params.message}
        onChange={value => {
          const newParams = { ...props.params }
          newParams.message = value
          props.onUpdate(newParams)
        }}
      />
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
      <LabeledSelect
        label="Record Id"
        selectedValue={props.params.dataType}
        options={models.map(model => ({
          label: model.name,
          value: model._id,
        }))}
        onChange={e => {
          const newParams = { ...props.params }
          newParams.dataType = e.target.value
          props.onUpdate(newParams)
        }}
      />

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
      <LabeledSelect
        label="Target"
        onChange={e => {
          const newScreen = e.target.value
          onUpdate({
            ...params,
            destination: newScreen,
          })
        }}
        options={navTargets.map(t => ({
          label: t.name,
          value: t._id,
        }))}
        selectedValue={params.destination}
      />
      {buildParameters()}
    </div>
  )
}

interface ConfigureFunctionProps {
  title?: string
  value: any
  componentId: string
  updateValue: (newValue: any, isValue: boolean) => void
}

function ConfigureFunction({
  title,
  value,
  componentId,
  updateValue,
}: ConfigureFunctionProps) {
  const [functions, setFunctions] = useState<ActionProps[]>([])
  const editor = (
    actionProps: ActionProps,
    onUpdate: (newValue: any) => void
  ) => {
    switch (actionProps.type) {
      case 'CREATE':
        return (
          <CreateEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'UPDATE':
        return (
          <UpdateEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'DELETE':
        return (
          <DeleteEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'NAVIGATE':
        return (
          <NavigateEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'LOGIN':
        return (
          <LoginEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'ALERT':
        return (
          <AlertEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )

      case 'CHANGE_INPUT':
        return (
          <ChangeInputEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'PASSWORD_RECOVERY':
        return (
          <ForgotPasswordEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'REGISTER':
        return (
          <RegisterEditor
            componentId={componentId}
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
    if (value) {
      initialValue = JSON.parse(value) as ActionProps[]
    } else {
      initialValue = []
    }
    setFunctions(initialValue)
  }, [value])
  return (
    <div>
      <span style={{ fontSize: '0.75em' }}>{title || 'undefined'}</span>
      <FunctionWrapper>
        {functions.map((f, index) => (
          <ActionWrapper key={index}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
              <LabeledSelect
                label="action type"
                selectedValue={f.type}
                onChange={e => {
                  const newFunctions = [...functions]
                  // @ts-ignore
                  newFunctions[index] = { type: e.target.value }
                  updateValue(JSON.stringify(newFunctions), true)
                }}
                options={FUNCTION_TYPES.map(t => ({
                  label: t.label,
                  value: t.value,
                }))}
              />
              <IconButton
                onClick={() => {
                  const newFunctions = [...functions]
                  newFunctions.splice(index, 1)
                  updateValue(JSON.stringify(newFunctions), true)
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            {editor(f, newValue => {
              setFunctions(fs => {
                fs[index] = newValue
                return [...fs]
              })
              updateValue(JSON.stringify(functions), true)
            })}
          </ActionWrapper>
        ))}
        <OutlinedButton
          onClick={() => {
            updateValue(
              JSON.stringify([...functions, { type: 'CREATE' }]),
              true
            )
          }}
        >
          New Action
        </OutlinedButton>
      </FunctionWrapper>
    </div>
  )
}

const FunctionEditor = function FunctionEditor(props: FunctionEditorProps) {
  return (
    <ConfigureFunction
      componentId={props.componentId}
      value={props.initialValue}
      title={props.schema.title}
      updateValue={props.updateValue}
    />
  )
}

export default FunctionEditor
