interface ApiConfig {

}

interface AuthConfig {
  authConfig: {
    loginMechanisms: string[] // used to define what fields are used for login
    signupAttributes: string[] // 
    passwordPolicy: {
      minLength: number
      requiredCharacters: string[]
    },
    mfaEnabled: boolean
    mfaType: 'EMAIL' | 'SMS' | 'AUTHENTICATOR'
    verification: 'EMAIL' | 'SMS' | 'AUTHENTICATOR'
  }
}