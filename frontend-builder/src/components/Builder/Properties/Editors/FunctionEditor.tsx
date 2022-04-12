import React, { useCallback, useEffect, useState } from 'react'
import { Props, FunctionSchema } from '@fuchsia/types'
import { useParams } from 'react-router-dom'
import {
  PackageComponentType,
  useGetBindingTreeQuery,
  useGetProjectQuery,
} from '../../../../generated/graphql'
import DataBinder, { DataStructure, MenuStructure } from './DataBinder'
import TextInputBinding from '../../../Shared/TextInputBinding'
import { OutlinedButton } from '../../../Shared/primitives/Button'
import styled from '@emotion/styled'
import { LabeledSelect } from '../../../Shared/primitives/LabeledSelect'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  AndFilter,
  Expression,
  Filter,
  NotFilter,
  OrFilter,
  PrimitiveFilter,
} from '@fuchsia/types'
import { Select } from '../../../Shared/primitives/Select'
import { EditorState } from 'draft-js'
import { EntitySelector } from '../../../Shared/EntitySelector'
import { useProjectComponents } from '../../../../utils/hooks/useProjectComponents'

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
  { label: 'Do something conditionally...', value: 'CONDITIONAL' },
  { label: 'Set a timer...', value: 'TIMER' },
  { label: 'Switch case...', value: 'SWITCH' },
]

type ComponentId = string
type EntityId = string

interface SwitchProps {
  type: 'SWITCH'
  switch: EditorState
  case?: Array<{
    key: EditorState
    actions: ActionProps[]
  }>
}

interface TimerProps {
  type: 'TIMER'
  timeout: number
  actions: ActionProps[]
}

interface LoginProps {
  type: 'LOGIN'
  username?: string
  password?: string
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

interface RegistrationProps {
  type: 'REGISTER'
  fields: { [key: string]: string }
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}
interface ChangeInputProps {
  type: 'CHANGE_INPUT'
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

interface PasswordRecoveryProps {
  type: 'PASSWORD_RECOVERY'
  message?: string
}

interface AlertProps {
  type: 'ALERT'
  message?: string
}

interface NavigateProps {
  type: 'NAVIGATE'
  destination?: ComponentId
  parameters?: { [targetParameterId: string]: { path: string; label: string } }
}

interface CreateProps {
  type: 'CREATE'
  dataType?: EntityId
  fields?: { [key: string]: string }
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

interface DeleteProps {
  type: 'DELETE'
  deleteElement?: { path: string; label: string }
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

interface UpdateProps {
  type: 'UPDATE'
  updateElement?: { entity: EntityId; path: string; label: string }
  fields?: { [key: string]: string }
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

interface ConditionalProps {
  type: 'CONDITIONAL'
  if?: Filter
  then?: ActionProps[]
  else?: ActionProps[]
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
  | ConditionalProps
  | TimerProps
  | SwitchProps

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

const SwitchEditor = (props: {
  componentId: string
  params: SwitchProps
  onUpdate: (newValue: SwitchProps) => void
}) => {
  return (
    <div>
      <span style={{ fontSize: '0.75ream' }}>Switch...</span>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={props.params.switch}
        onChange={value => {
          const newParams = { ...props.params }
          newParams.switch = value
          props.onUpdate(newParams)
        }}
      />
      {props.params.case?.map(caseStatement => (
        <div>
          <ConfigureFunction
            title="Case..."
            Control={
              <TextInputBinding
                componentId={props.componentId}
                initialValue={caseStatement.key}
                onChange={value => {
                  // const newParams = { ...props.params }
                  // newParams.switch = value
                  // props.onUpdate(newParams)
                }}
              />
            }
            componentId={props.componentId}
            value={caseStatement.actions}
            updateValue={value => {
              // props.onUpdate({
              //   ...props.params,
              //   actions: value,
              // })
            }}
          />
        </div>
      ))}
      <OutlinedButton
        onClick={() => {
          const newParams = { ...props.params }
          if (!newParams.case) {
            newParams.case = []
          }
          newParams.case.push({
            key: EditorState.createEmpty(),
            actions: [],
          })
          props.onUpdate(newParams)
        }}
      >
        Add New
      </OutlinedButton>
    </div>
  )
}

const TimerEditor = (props: {
  componentId: string
  params: TimerProps
  onUpdate: (newValue: TimerProps) => void
}) => {
  return <div>Timer Editor</div>
}

const ConditionalBuiler = ({
  componentId,
  filter,
  onChange,
  onDelete,
  menuStructure,
  entityStructure,
  extractModelName,
}: {
  componentId: string
  filter?: Filter
  menuStructure: MenuStructure[]
  entityStructure: { [key: string]: DataStructure }
  onChange: (newValue: Filter) => void
  onDelete: () => void
  extractModelName: (parameter: string) => [string, boolean]
}) => {
  function localChange(newValue: Filter) {
    onChange({
      ...filter,
      ...newValue,
    })
  }
  function getOperandInput(expression: Expression) {
    switch (expression.operator) {
      case '$exists':
        return null
      case '$match': {
        return (
          <Select
            selectedValue={expression.operand}
            options={[
              {
                label: 'is Email',
                value: /regex/,
              },
            ]}
            onChange={e => {}}
          />
        )
      }
      default:
        return <TextInputBinding componentId={componentId} onChange={e => {}} />
    }
  }
  function getConditionValue(filter: Filter) {
    switch (filter.key) {
      case '$and':
        return (
          <FunctionWrapper style={{ borderColor: 'var(--attention)' }}>
            {(filter as AndFilter).value.map((f, index) => (
              <ActionWrapper>
                <ConditionalBuiler
                  filter={f}
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
                  componentId={componentId}
                  menuStructure={menuStructure}
                  entityStructure={entityStructure}
                  extractModelName={extractModelName}
                />
              </ActionWrapper>
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
                } as AndFilter)
              }}
            >
              Add New
            </OutlinedButton>
          </FunctionWrapper>
        )
      case '$or':
        return <div>or</div>
      case '$not':
        return <div>not</div>
      default:
        return (
          <div>
            <Select
              selectedValue={(filter.value as Expression).operator}
              options={[
                {
                  label: '=',
                  value: '$eq',
                },
                {
                  label: '!=',
                  value: '$ne',
                },
                {
                  label: '>',
                  value: '$gt',
                },
                {
                  label: '<',
                  value: '$lt',
                },
                {
                  label: '>=',
                  value: '$gte',
                },
                {
                  label: '<=',
                  value: '$lte',
                },
                {
                  label: 'not empty',
                  value: '$exists',
                },
                {
                  label: 'matches',
                  value: '$match',
                },
              ]}
              onChange={e => {
                const newFilter = { ...filter } as PrimitiveFilter
                ;(newFilter.value as Expression).operator = e.target.value
                localChange(newFilter)
              }}
            />
            {getOperandInput(filter.value as Expression)}
          </div>
        )
    }
  }
  return (
    <div>
      <div style={{ border: 'solid 1px var(--accent)', borderRadius: 5 }}>
        <DataBinder
          onSelect={(entityId, label) => {
            let value
            switch (entityId) {
              case '$and':
                value = {
                  key: entityId,
                  value: [] as Filter[],
                } as AndFilter
                break
              case '$or':
                value = {
                  key: entityId,
                  value: [] as Filter[],
                } as OrFilter
                break
              case '$not':
                value = {
                  key: entityId,
                  value: {} as Filter,
                } as NotFilter
                break
              default:
                value = {
                  key: entityId,
                  value: {
                    operator: '',
                  },
                } as PrimitiveFilter
                break
            }
            onChange(value)
          }}
          entry={[
            {
              type: 'PRIMITIVE',
              entity: '$and',
              source: '$and',
              hasSubMenu: false,
              label: '$and',
            },
            {
              type: 'PRIMITIVE',
              entity: '$or',
              source: '$or',
              hasSubMenu: false,
              label: '$or',
            },
            {
              type: 'PRIMITIVE',
              entity: '$not',
              source: '$not',
              hasSubMenu: false,
              label: '$not',
            },
            ...menuStructure,
          ]}
          dataStructure={entityStructure}
        />
        <span title={filter && filter.key.split('.').join(' > ')}>
          {filter && extractModelName(filter.key.split('.').pop() || '')[0]}
        </span>
      </div>
      {filter && getConditionValue(filter)}
    </div>
  )
}

const ConditionalEditor = (props: {
  componentId: string
  params: ConditionalProps
  onUpdate: (newValue: ConditionalProps) => void
}) => {
  const [structure, setStructure] = useState<MenuStructure[]>([])
  const [entityStructure, setEntityStructure] = useState<{
    [key: string]: DataStructure
  }>({})
  const { projectId } = useParams<{ projectId: string }>()
  const { data: bindingTreeData } = useGetBindingTreeQuery({
    variables: {
      projectId,
      componentId: props.componentId,
    },
  })
  const extractModelName = useCallback(
    (parameter: string): [string, boolean] => {
      if (entityStructure[parameter]) {
        return [entityStructure[parameter].name, true]
      } else if (entityStructure['InputObject']) {
        const input = entityStructure['InputObject'].fields.find(
          field => field.source === parameter
        )
        if (input) {
          return [input.label, true]
        }
      }
      return [parameter, false]
    },
    [entityStructure]
  )
  useEffect(() => {
    if (bindingTreeData) {
      const dataStructure = bindingTreeData.getBindingTree.structure.reduce(
        (acc, structure) => {
          // @ts-ignore
          acc[structure._id] = structure
          return acc
        },
        {} as { [key: string]: DataStructure }
      )
      // @ts-ignore
      setStructure(bindingTreeData.getBindingTree.menu)
      setEntityStructure(dataStructure)
    }
  }, [bindingTreeData])
  return (
    <div>
      <span style={{ fontSize: '0.75em' }}>If...</span>
      <FunctionWrapper>
        <ConditionalBuiler
          componentId={props.componentId}
          filter={props.params.if}
          onChange={e => {
            props.onUpdate({
              ...props.params,
              if: e,
            })
          }}
          onDelete={function (): void {
            throw new Error('Function not implemented.')
          }}
          menuStructure={structure}
          entityStructure={entityStructure}
          extractModelName={extractModelName}
        />
      </FunctionWrapper>
      <ConfigureFunction
        title="Then..."
        componentId={props.componentId}
        value={props.params.then}
        updateValue={value => {
          props.onUpdate({
            ...props.params,
            then: value,
          })
        }}
      />
      <ConfigureFunction
        title="Else..."
        componentId={props.componentId}
        value={props.params.else}
        updateValue={value => {
          props.onUpdate({
            ...props.params,
            else: value,
          })
        }}
      />
    </div>
  )
}

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
        initialValue={props.params.username as any}
        onChange={value => {
          const newParams = { ...props.params }
          newParams.username = value
          props.onUpdate(newParams)
        }}
      />
      <div style={{ fontSize: '0.75rem' }}>Password</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={props.params.password as any}
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
                [key: string]: string
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
                    initialValue={
                      props.params.fields && (props.params.fields[f] as any)
                    }
                    onChange={value => {
                      const newProps = { ...props.params }
                      if (!newProps.fields) {
                        newProps.fields = {}
                      }
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
      <EntitySelector
        componentId={props.componentId}
        selectedLabel={props.params.updateElement?.label}
        onSelect={(entity, path, label) => {
          const newParams = { ...props.params }
          newParams.updateElement = {
            entity: entity,
            label: label,
            path: path,
          }
          const model = models.find(model => model._id === entity)
          if (model) {
            newParams.fields = model.fields.reduce(
              (acc, f) => {
                acc[f._id] = ''
                return acc
              },
              {} as {
                [key: string]: string
              }
            )
            props.onUpdate(newParams)
          }
        }}
      />
      {props.params &&
        props.params.fields &&
        Object.keys(props.params.fields).map(f => {
          const model = models.find(
            model => model._id === props.params.updateElement?.entity
          )
          if (model) {
            const field = model.fields.find(field => field._id === f)
            if (field) {
              return (
                <React.Fragment key={field._id}>
                  <div>{field.fieldName}</div>
                  <TextInputBinding
                    componentId={props.componentId}
                    initialValue={
                      props.params.fields && (props.params.fields[f] as any)
                    }
                    onChange={value => {
                      const newProps = { ...props.params }
                      if (!newProps.fields) {
                        newProps.fields = {}
                      }
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
        initialValue={props.params.message as any}
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
  const { projectId } = useParams<{ projectId: string }>()
  const { data, loading, error } = useGetProjectQuery({
    variables: { projectId },
  })
  if (loading || error || !data) {
    return null
  }

  const { appConfig } = data.getProject
  return (
    <div>
      {appConfig.apiConfig.models
        .find(m => m._id === appConfig.authConfig.tableId)
        ?.fields.map(field => (
          <React.Fragment key={field._id}>
            <div>
              {field.fieldName}{' '}
              {field.nullable || !!field.connection ? '' : '(required)'}
            </div>
            <TextInputBinding
              componentId={props.componentId}
              initialValue={
                props.params.fields && (props.params.fields[field._id] as any)
              }
              onChange={value => {
                const newProps = { ...props.params }
                if (!newProps.fields) {
                  newProps.fields = {}
                }
                newProps.fields[field._id] = value
                props.onUpdate(newProps)
              }}
            />
          </React.Fragment>
        ))}
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
        initialValue={props.params.message as any}
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
  return (
    <div>
      <EntitySelector
        componentId={props.componentId}
        selectedLabel={props.params.deleteElement?.label}
        onSelect={(path, label) => {
          props.onUpdate({
            ...props.params,
            deleteElement: {
              label,
              path,
            },
          })
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
  const components = useProjectComponents(projectId!)
  const [navTargets, setNagTargets] = useState<
    Array<{
      name: string
      _id: string
      parameters?: Array<{
        _id: string
        entityType: string
        label: string
        path: string
      }> | null
    }>
  >([])
  const buildParameters = () => {
    const target = navTargets.find(t => t._id === params.destination)
    if (target) {
      if (target.parameters && target.parameters.length > 0) {
        return target.parameters.map(p => (
          <EntitySelector
            entityId={p.entityType}
            componentId={componentId}
            selectedLabel={params.parameters && params.parameters[p._id]?.label}
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
          />
        ))
      } else {
        return <div>No parameters</div>
      }
    }
    return null
  }
  useEffect(() => {
    if (components) {
      setNagTargets(
        components.filter(c => c.componentType === PackageComponentType.Screen)
      )
    }
  }, [components])
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
  Control?: JSX.Element
  updateValue: (newValue: any, isValue: boolean) => void
}

function ConfigureFunction({
  title,
  value,
  componentId,
  updateValue,
  Control,
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
      case 'CONDITIONAL':
        return (
          <ConditionalEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'TIMER':
        return (
          <TimerEditor
            componentId={componentId}
            params={actionProps}
            onUpdate={onUpdate}
          />
        )
      case 'SWITCH':
        return (
          <SwitchEditor
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
      initialValue = value as ActionProps[]
    } else {
      initialValue = []
    }
    setFunctions(initialValue)
  }, [value])
  return (
    <div>
      <span style={{ fontSize: '0.75em' }}>{title || 'undefined'}</span>
      <FunctionWrapper>
        {Control}
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
                  updateValue(newFunctions, true)
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
                  updateValue(newFunctions, true)
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            {editor(f, newValue => {
              const newFunctions = [...functions]
              newFunctions[index] = newValue
              updateValue(newFunctions, true)
            })}
          </ActionWrapper>
        ))}
        <OutlinedButton
          onClick={() => {
            updateValue([...functions, { type: 'CREATE' }], true)
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
