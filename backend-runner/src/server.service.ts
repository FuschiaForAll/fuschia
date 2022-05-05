import { Service } from "typedi"
import Docker from 'dockerode'
import { DOCKERHUB_USERNAME, DOCKERHUB_TOKEN } from "./config"
import { InitServerInput } from "./InitServer.input"

@Service()
export class ServerService {
  public async updateServer(sandbox: boolean, initServerInput: InitServerInput, version?: string) {
    const docker = new Docker()
    console.log('pulling server')
    await docker.pull(`pragmaflowinc/${initServerInput.projectId}-server:${version ? `${version}-server` : 'latest-server'}`, {
      authconfig: {
        username: DOCKERHUB_USERNAME,
        password: DOCKERHUB_TOKEN,
        serveraddress: 'https://hub.docker.com/'
      }
    })
    console.log('killing old container')
    const oldContainer = docker.getContainer(sandbox ? 'sandbox' : 'production')
    try {
      await oldContainer.kill()
      await oldContainer.remove()
    } catch (e) {
      console.log(e)
    }
    console.log('creating container')
    const container = await docker.createContainer({
      Tty: true,
      name: sandbox ? 'sandbox' : 'production',
      Image:`pragmaflowinc/${initServerInput.projectId}-server:${version ? `${version}-server` : 'latest-server'}`,
      Env: [
        `SESSION_SECRET=${initServerInput.sessionSecret}`,
        `MONGO_DB_URL=${initServerInput.mongoDbConnectionString ? initServerInput.mongoDbConnectionString : 'mongodb://127.0.0.1:27017'}`,
        `DATABASE_NAME=${initServerInput.databaseName ? initServerInput.databaseName : `${initServerInput.projectId}${sandbox ? 'sandbox' : 'production'}`}`,
        `REDIS_URL=${initServerInput.redisUrl ? initServerInput.redisUrl : 'localhost'}`,
        `REDIS_PORT=${initServerInput.redisPort ? initServerInput.redisPort : '6379'}`,
        `PORT=${initServerInput.serverPort}`,
        `S3_ACCESS_KEY=${initServerInput.s3AccessKey}`,
        `S3_SECRET=${initServerInput.s3secret}`,
        `S3_BUCKET_NAME=${initServerInput.s3BucketName}`,
        `APP_ENDPOINT=${initServerInput.appEndpoint}`,
        `FROM_EMAIL_ADDRESS=${initServerInput.fromEmailAddress}`,
        `EMAIL_TYPE=${initServerInput.emailConfigType}`,
        `EMAIL_HOST=${initServerInput.emailHost}`,
        `EMAIL_PORT=${initServerInput.emailPassword}`,
        `EMAIL_USER=${initServerInput.emailUser}`,
        `EMAIL_PASS=${initServerInput.emailPassword}`,
      ],
      HostConfig: {
        NetworkMode: "host"
      }
    })
    console.log('starting container')
    container.start()
  }
}