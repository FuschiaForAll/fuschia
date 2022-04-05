import { EditorState } from 'draft-js'

type ComponentId = string
type EntityId = string

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

export interface SwitchProps {
  type: 'SWITCH'
  switch: EditorState
  case?: Array<{
    key: EditorState
    actions: ActionProps[]
  }>
}

export interface TimerProps {
  type: 'TIMER'
  timeout: number
  actions: ActionProps[]
}

export interface LoginProps {
  type: 'LOGIN'
  username?: string
  password?: string
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

export interface RegistrationProps {
  type: 'REGISTER'
  fields: { [key: string]: string }
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}
export interface ChangeInputProps {
  type: 'CHANGE_INPUT'
  onSucess?: ActionProps[]
  onFail?: ActionProps[]
}

export interface PasswordRecoveryProps {
  type: 'PASSWORD_RECOVERY'
  message?: string
}

export interface AlertProps {
  type: 'ALERT'
  message?: string
}

export interface NavigateProps {
  type: 'NAVIGATE'
  destination?: ComponentId
  parameters?: { [targetParameterId: string]: { path: string; label: string } }
}

export interface CreateProps {
  type: 'CREATE'
  dataType?: EntityId
  fields?: { [key: string]: string }
  onSucess?: () => void
  onFail?: () => void
}

export interface DeleteProps {
  type: 'DELETE'
  deleteElement?: { path: string; label: string }
  onSucess?: () => void
  onFail?: () => void
}

export interface UpdateProps {
  type: 'UPDATE'
  updateElement?: { entity: EntityId; path: string; label: string }
  fields?: { [key: string]: string }
  onSucess?: () => void
  onFail?: () => void
}

export interface ConditionalProps {
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
