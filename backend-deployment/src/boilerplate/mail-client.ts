import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { EMAIL_CLIENT } from './config'

let client: Mail

if (EMAIL_CLIENT.type === 'OAuth2') {
  client = createTransport({
    service: EMAIL_CLIENT.service,
    auth: {
      type: EMAIL_CLIENT.type,
      user: EMAIL_CLIENT.user,
      clientId: EMAIL_CLIENT.clientId,
      clientSecret: EMAIL_CLIENT.clientSecret,
      refreshToken: EMAIL_CLIENT.refreshToken,
      expires: EMAIL_CLIENT.expires,
    },
  })
} else {
  client = createTransport({
    host: EMAIL_CLIENT.host,
    port: EMAIL_CLIENT.port,
    auth: {
      user: EMAIL_CLIENT.user,
      pass: EMAIL_CLIENT.pass,
    },
  })
}

export const mailClient = client
