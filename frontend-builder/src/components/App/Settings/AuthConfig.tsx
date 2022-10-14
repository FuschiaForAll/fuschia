// import { SelectChangeEvent } from '@mui/material'
import React from 'react'
import {
  useGetAuthQuery,
  useGetProjectQuery,
  useUpdateAuthMutation,
} from '../../../generated/graphql'
import { LabeledCheckbox } from '../../Shared/primitives/LabeledCheckbox'
import { LabeledSelect } from '../../Shared/primitives/LabeledSelect'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'

export function AuthConfig({ projectId }: { projectId: string }) {
  const { data: authConfigData } = useGetAuthQuery({
    variables: {
      projectId,
    },
  })
  const { data, loading, error } = useGetProjectQuery({
    variables: { projectId },
  })
  const [updateAuthData] = useUpdateAuthMutation()
  function onChangeHandler(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const field = e.target.name
    let value
    if (e.target.type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked
    } else if (e.target.type === 'number') {
      value = +e.target.value
    } else {
      value = e.target.value
    }
    // @ts-ignore
    if (authConfigData.getAuth[field] !== value) {
      updateAuthData({
        variables: {
          projectId,
          input: {
            [field]: value,
          },
        },
      })
    }
  }

  // function onSelectChangeHandler(
  //   event: SelectChangeEvent<unknown>,
  //   child: React.ReactNode
  // ) {}

  if (error) {
    return <div>Error</div>
  }
  if (!authConfigData?.getAuth || loading) {
    return <div>Loading Auth...</div>
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <h1>Auth Config</h1>
      <div>
        <div className="auth">
          <LabeledCheckbox
            name="requiresAuth"
            label="Does your app need authentication? Check the box and select the level of security you need. "
            checked={authConfigData.getAuth.requiresAuth}
            onChange={onChangeHandler}
          />
        </div>
        {authConfigData.getAuth.requiresAuth && (
          <React.Fragment>
            <div className="auth">
              <LabeledCheckbox
                label="Do you want to allow unauthenticated users"
                name="allowUnauthenticatedUsers"
                checked={authConfigData.getAuth.allowUnauthenticatedUsers}
                onChange={onChangeHandler}
              />
            </div>
            <div className="auth">
              <label htmlFor="mfaEnabled"></label>
              <LabeledCheckbox
                label="Do you want to Enable Multifactor Authentication (mfa)"
                name="mfaEnabled"
                checked={authConfigData.getAuth.mfaEnabled}
                onChange={onChangeHandler}
              />
            </div>
          </React.Fragment>
        )}
        {authConfigData.getAuth.requiresAuth && (
          <React.Fragment>
            {authConfigData.getAuth.mfaEnabled && (
              <div className="container">
                <div className="container1">
                  <LabeledSelect
                    labelPlacement="start"
                    label="mfa Configuration"
                    options={[
                      { label: 'OFF', value: 'OFF' },
                      { label: 'ON', value: 'ON' },
                      { label: 'OPTIONAL', value: 'OPTIONAL' },
                    ]}
                    selectedValue={authConfigData.getAuth.mfaConfiguration}
                    onChange={() => {}}
                  />
                </div>
                <div className="container1">
                  <LabeledSelect
                    labelPlacement="start"
                    label="mfa types"
                    selectedValue={authConfigData.getAuth.mfaTypes}
                    onChange={() => {}}
                    options={[
                      { label: 'SMS', value: 'SMS' },
                      { label: 'TOTP', value: 'TOTP' },
                      { label: 'EMAIL', value: 'EMAIL' },
                    ]}
                  />
                </div>
                <div className="container1">
                  <LabeledTextInput
                    label="SMS Authentication Message"
                    fontSize="0.75 rem"
                    labelPlacement="start"
                    name="smsAuthenticationMessage"
                    type="text"
                    defaultValue={
                      authConfigData.getAuth.smsAuthenticationMessage
                    }
                    onBlur={onChangeHandler}
                  />
                </div>
                <div className="container1">
                  <LabeledTextInput
                    label="SMS Verification Message"
                    fontSize="0.75 rem"
                    labelPlacement="start"
                    name="smsVerificationMessage"
                    type="text"
                    defaultValue={authConfigData.getAuth.smsVerificationMessage}
                    onBlur={onChangeHandler}
                  />
                </div>
              </div>
            )}
            <div className="container">
              <h2>Email and Password settings</h2>
              <div className="container1">
                <label htmlFor="emailVerificationSubject">
                  Email Verification Subject
                </label>
                <input
                  name="emailVerificationSubject"
                  type="text"
                  defaultValue={authConfigData.getAuth.emailVerificationSubject}
                  onBlur={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="emailVerificationMessage">
                  Email Verification Message
                </label>
                <input
                  name="emailVerificationMessage"
                  type="text"
                  defaultValue={authConfigData.getAuth.emailVerificationMessage}
                  onBlur={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="defaultPasswordPolicy">
                  Enable Password Policy
                </label>
                <input
                  name="defaultPasswordPolicy"
                  type="checkbox"
                  checked={authConfigData.getAuth.defaultPasswordPolicy}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="passwordPolicyMinLength">
                  Minimum Password Length
                </label>
                <input
                  name="passwordPolicyMinLength"
                  type="number"
                  min={0}
                  max={100}
                  value={authConfigData.getAuth.passwordPolicyMinLength}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="passwordRequiresUppercase">
                  Password Requires Uppercase Letters
                </label>
                <input
                  name="passwordRequiresUppercase"
                  type="checkbox"
                  checked={authConfigData.getAuth.passwordRequiresUppercase}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="passwordRequiresNumbers">
                  Password Requires Numbers
                </label>
                <input
                  name="passwordRequiresNumbers"
                  type="checkbox"
                  checked={authConfigData.getAuth.passwordRequiresNumbers}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="passwordRequiresSymbols">
                  Password Requires Symbols
                </label>
                <input
                  name="passwordRequiresSymbols"
                  type="checkbox"
                  checked={authConfigData.getAuth.passwordRequiresSymbols}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="clientRefreshTokenValidity">
                  How often does a user need to log in?
                </label>
                <input
                  name="clientRefreshTokenValidity"
                  type="number"
                  min={0}
                  max={100}
                  value={authConfigData.getAuth.clientRefreshTokenValidity}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="container1">
                <label htmlFor="usernameCaseSensitive">
                  Is the username case sensitive?
                </label>
                <input
                  name="usernameCaseSensitive"
                  type="checkbox"
                  checked={authConfigData.getAuth.usernameCaseSensitive}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="container">
              <div className="container1">
                <LabeledSelect
                  labelPlacement="start"
                  label="Where is the user login information stored?"
                  selectedValue={authConfigData.getAuth.tableId}
                  options={[
                    { label: 'Undefined', value: '' },
                    ...(data?.getProject.serverConfig.apiConfig.models.map(
                      model => ({
                        label: model.name,
                        value: model._id,
                      })
                    ) || []),
                  ]}
                  onChange={e => {
                    const value = e.target.value
                    updateAuthData({
                      variables: {
                        projectId,
                        input: {
                          tableId: value,
                        },
                      },
                    })
                  }}
                />
              </div>
              <div className="container1">
                <label
                  style={{ whiteSpace: 'nowrap' }}  
                  htmlFor= "usernameFieldId">
                  Where is the user login field?
                </label>
                <select
                  name="usernameFieldId"
                  value={authConfigData.getAuth.usernameFieldId}
                  onChange={onChangeHandler}
                >
                  {!authConfigData.getAuth.usernameFieldId && (
                    <option value="">Undefined</option>
                  )}
                  {data?.getProject.serverConfig.apiConfig.models.find(
                    model => model._id === authConfigData.getAuth!.tableId
                  ) &&
                    data?.getProject.serverConfig.apiConfig.models
                      .find(
                        model => model._id === authConfigData.getAuth!.tableId
                      )!
                      .fields.filter(field => field.isUnique)
                      .map(field => (
                        <option key={field._id} value={field._id}>
                          {field.fieldName}
                        </option>
                      ))}
                </select>
              </div>
              <div className="container1">
                <label
                style={{ whiteSpace: 'nowrap' }} 
                htmlFor="passwordFieldId">
                  Where is the user password field?
                </label>
                <select
                  name="passwordFieldId"
                  value={authConfigData.getAuth.passwordFieldId}
                  onChange={onChangeHandler}
                >
                  {!authConfigData.getAuth.passwordFieldId && (
                    <option value="">Undefined</option>
                  )}
                  {data?.getProject.serverConfig.apiConfig.models.find(
                    model => model._id === authConfigData.getAuth!.tableId
                  ) &&
                    data?.getProject.serverConfig.apiConfig.models
                      .find(
                        model => model._id === authConfigData.getAuth!.tableId
                      )!
                      .fields.filter(field => field.isHashed)
                      .map(field => (
                        <option key={field._id} value={field._id}>
                          {field.fieldName}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
