import React from 'react'
import { useUpdateAuthMutation } from '../../../generated/graphql'

export function AuthConfig() {
  const [updateAuthData] = useUpdateAuthMutation()
  return (
    <div>
      <h1>Auth Config</h1>
      <div>
        <div>
          <label htmlFor="requiresAuth">
            Does you app need authentication?
          </label>
          <input name="requiresAuth" type="checkbox" />
        </div>
        <div>
          <label htmlFor="allowUnauthenticatedUsers">
            Allow unauthenticated users
          </label>
          <input name="allowUnauthenticatedUsers" type="checkbox" />
        </div>
        <div>
          <label htmlFor="mfaEnabled">
            Enabled Multifactor Authentication (mfa)
          </label>
          <input name="mfaEnabled" type="checkbox" />
        </div>
        <div>
          <label htmlFor="mfaConfiguration">mfa Configuration</label>
          <select name="mfaConfiguration">
            <option>OFF</option>
            <option>ON</option>
            <option>OPTIONAL</option>
          </select>
        </div>
        <div>
          <label htmlFor="mfaTypes">mfa types</label>
          <select name="mfaConfiguration">
            <option>SMS</option>
            <option>TOTP</option>
            <option>EMAIL</option>
          </select>
        </div>
        <div>
          <label htmlFor="smsAuthenticationMessage">
            SMS Authentication Message
          </label>
          <input name="smsAuthenticationMessage" type="text" />
        </div>
        <div>
          <label htmlFor="smsVerificationMessage">
            SMS Verification Message
          </label>
          <input name="smsVerificationMessage" type="text" />
        </div>
        <div>
          <label htmlFor="emailVerificationSubject">
            Email Verification Subject
          </label>
          <input name="emailVerificationSubject" type="text" />
        </div>
        <div>
          <label htmlFor="emailVerificationMessage">
            Email Verification Message
          </label>
          <input name="emailVerificationMessage" type="text" />
        </div>
        <div>
          <label htmlFor="defaultPasswordPolicy">Enable Password Policy</label>
          <input name="defaultPasswordPolicy" type="checkbox" />
        </div>
        <div>
          <label htmlFor="passwordPolicyMinLength">
            Minimum Password Length
          </label>
          <input
            name="passwordPolicyMinLength"
            type="number"
            min={0}
            max={100}
          />
        </div>
        <div>
          <label htmlFor="passwordRequiresUppercase">
            Password Requires Uppercase Letters
          </label>
          <input name="passwordRequiresUppercase" type="checkbox" />
        </div>
        <div>
          <label htmlFor="passwordRequiresNumbers">
            Password Requires Numbers
          </label>
          <input name="passwordRequiresNumbers" type="checkbox" />
        </div>
        <div>
          <label htmlFor="passwordRequiresSymbols">
            Password Requires Symbols
          </label>
          <input name="passwordRequiresSymbols" type="checkbox" />
        </div>
        <div>
          <label htmlFor="clientRefreshTokenValidity">
            How often does a user need to log in?
          </label>
          <input
            name="clientRefreshTokenValidity"
            type="number"
            min={0}
            max={100}
          />
        </div>
        <div>
          <label htmlFor="usernameCaseSensitive">
            Is the username case sensitive?
          </label>
          <input name="usernameCaseSensitive" type="checkbox" />
        </div>
        <div>
          <label htmlFor="tableId">
            Where is the user login information stored?
          </label>
          <select>
            <option>User table</option>
          </select>
        </div>
        <div>
          <label htmlFor="usernameFieldId">
            Where is the user login field?
          </label>
          <select>
            <option>Email</option>
          </select>
        </div>
        <div>
          <label htmlFor="passwordFieldId">
            Where is the user password field?
          </label>
          <select>
            <option>Password</option>
          </select>
        </div>
        <button
          onClick={() => {
            // save
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
