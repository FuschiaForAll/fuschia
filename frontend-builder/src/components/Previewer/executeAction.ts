import { ActionProps } from '../Builder/Properties/Editors/FunctionEditor'

export function executeAction(
  action: ActionProps,
  navigate: (desination: string) => void,
  convertDraftJSBindings: (
    value: any,
    inputState: any,
    entityState: any
  ) => string,
  inputState: any,
  entityState: any,
  project: any,
  onEntityChange: (data: any) => void
) {
  switch (action.type) {
    case 'NAVIGATE':
      if (action.destination) {
        navigate(action.destination)
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
            entityState
          )
          payload[key] = normalizedText
        })
        const newState = { ...entityState }
        if (!newState[project.appConfig.authConfig.tableId]) {
          newState[project.appConfig.authConfig.tableId] = []
        }
        newState[project.appConfig.authConfig.tableId].push(payload)
        onEntityChange(newState)
        alert(JSON.stringify(newState))
      }
      break
    case 'LOGIN':
      {
        // parse fields
        const payload = {
          username: convertDraftJSBindings(
            action.username,
            inputState,
            entityState
          ),
          password: convertDraftJSBindings(
            action.password,
            inputState,
            entityState
          ),
        }
        debugger
        if (entityState[project.appConfig.authConfig.tableId]) {
          const user = entityState[project.appConfig.authConfig.tableId].find(
            (e: any) => {
              debugger
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
              action.onSucess.forEach(a =>
                executeAction(
                  a,
                  navigate,
                  convertDraftJSBindings,
                  inputState,
                  entityState,
                  project,
                  onEntityChange
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
                  project,
                  onEntityChange
                )
              )
            }
          }
        }
      }
      break
    case 'ALERT':
      alert(convertDraftJSBindings(action.message, inputState, entityState))
      break
  }
}
