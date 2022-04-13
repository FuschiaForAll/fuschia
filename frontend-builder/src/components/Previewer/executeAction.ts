import { uuid } from 'short-uuid'
import { ActionProps } from '../Builder/Properties/Editors/FunctionEditor'

export function executeAction(
  action: ActionProps,
  navigate: (desination: string, dataParameters?: any) => void,
  convertDraftJSBindings: (
    value: any,
    inputState: any,
    entityState: any,
    localState: any,
    dataContext: any
  ) => string,
  inputState: any,
  entityState: any,
  localState: any,
  project: any,
  onEntityChange: (data: any) => void,
  onLocalStateChange: (data: any) => void,
  dataContext: any
) {
  switch (action.type) {
    case 'NAVIGATE':
      if (action.destination) {
        if (action.parameters) {
          navigate(action.destination, dataContext)
        } else {
          navigate(action.destination)
        }
      }
      break
    case 'REGISTER':
      {
        // parse fields
        const payload = {} as any
        Object.keys(action.fields).forEach(key => {
          const normalizedText = convertDraftJSBindings(
            action.fields[key],
            inputState,
            entityState,
            localState,
            dataContext
          )
          payload[key] = normalizedText
        })
        const newState = { ...entityState }
        if (!newState[project.appConfig.authConfig.tableId]) {
          newState[project.appConfig.authConfig.tableId] = []
        }
        payload._id = uuid()
        newState[project.appConfig.authConfig.tableId].push(payload)
        onEntityChange(newState)
        onLocalStateChange({
          ...localState,
          CurrentUser: payload._id,
        })
      }
      break
    case 'LOGIN':
      {
        // parse fields
        const payload = {
          username: convertDraftJSBindings(
            action.username,
            inputState,
            entityState,
            localState,
            dataContext
          ),
          password: convertDraftJSBindings(
            action.password,
            inputState,
            entityState,
            localState,
            dataContext
          ),
        }
        if (entityState[project.appConfig.authConfig.tableId]) {
          const user = entityState[project.appConfig.authConfig.tableId].find(
            (e: any) => {
              return (
                e[project.appConfig.authConfig.usernameFieldId] ===
                  payload.username &&
                e[project.appConfig.authConfig.passwordFieldId] ===
                  payload.password
              )
            }
          )
          if (user) {
            if (action.onSucess) {
              onLocalStateChange({
                ...localState,
                CurrentUser: user._id,
              })
              action.onSucess.forEach(a =>
                executeAction(
                  a,
                  navigate,
                  convertDraftJSBindings,
                  inputState,
                  entityState,
                  localState,
                  project,
                  onEntityChange,
                  onLocalStateChange,
                  dataContext
                )
              )
            }
          } else {
            if (action.onFail) {
              action.onFail.forEach(a =>
                executeAction(
                  a,
                  navigate,
                  convertDraftJSBindings,
                  inputState,
                  entityState,
                  localState,
                  project,
                  onEntityChange,
                  onLocalStateChange,
                  dataContext
                )
              )
            }
          }
        }
      }
      break
    case 'ALERT':
      alert(
        convertDraftJSBindings(
          action.message,
          inputState,
          entityState,
          localState,
          dataContext
        )
      )
      break
    case 'CREATE':
      if (action.dataType && action.fields) {
        const payload = {} as any
        Object.keys(action.fields).forEach(key => {
          if (action.fields![key]) {
            const normalizedText = convertDraftJSBindings(
              action.fields![key],
              inputState,
              entityState,
              localState,
              dataContext
            )
            payload[key] = normalizedText
          }
        })
        payload._id = uuid()
        const newState = { ...entityState }
        if (!newState[action.dataType]) {
          newState[action.dataType] = []
        }
        newState[action.dataType].push(payload)
        onEntityChange(newState)
      }
      break
    case 'DELETE':
      if (action.deleteElement) {
        if (entityState[action.deleteElement.path]) {
          const newState = { ...entityState }
          newState[action.deleteElement.path] = newState[
            action.deleteElement.path
          ].filter((element: any) => element._id !== dataContext._id)
          onEntityChange(newState)
        }
      }
      break
    case 'UPDATE':
      if (action.updateElement) {
        if (entityState[action.updateElement.entity]) {
          const newState = { ...entityState }
          const elementToUpdate = newState[action.updateElement.entity].find(
            (element: any) => element._id === dataContext._id
          )
          if (elementToUpdate && action.fields) {
            Object.keys(action.fields).forEach(key => {
              if (action.fields![key]) {
                // something to update
                elementToUpdate[key] = convertDraftJSBindings(
                  action.fields![key],
                  inputState,
                  entityState,
                  localState,
                  dataContext
                )
              }
            })
            onEntityChange(newState)
          }
        }
      }
      break
  }
}
