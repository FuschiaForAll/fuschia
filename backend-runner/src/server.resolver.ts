import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ServerService } from "./server.service";
import fs from 'fs-extra'
import path from 'path'
import { InitServerInput } from "./InitServer.input";
@Service()
@Resolver()
export class ServerResolver {
  constructor(
    private serverService: ServerService
  ) {}
    @Query(type => Boolean)
    async getServerVersions() {
      throw new Error('Not Implemented')
    }

    @Mutation(type => Boolean)
    async initializeProductionServer(
      @Arg('initInput', type => InitServerInput) initInput: InitServerInput
    ) {
      fs.writeFileSync(path.join(__dirname, 'production.serverconfig'), JSON.stringify(initInput), { flag: 'wx' })
      return true
    }

  @Mutation(type => Boolean)
  async initializeSandboxServer(
    @Arg('initInput', type => InitServerInput) initInput: InitServerInput
  ) {
    fs.writeFileSync(path.join(__dirname, 'sandbox.serverconfig'), JSON.stringify(initInput), { flag: 'wx' })
    return true
  }

  @Mutation(type => Boolean)
  async updateSandboxServer(
    @Arg('version', { nullable: true }) version?: string
  ) {
    console.log('updateSandboxServer')
    if (fs.existsSync(path.join(__dirname, 'sandbox.serverconfig'))) {
      const info = fs.readFileSync(path.join(__dirname, 'sandbox.serverconfig'), 'utf8')
      const serverConfig = JSON.parse(info) as InitServerInput
      console.log(`projectId`)
      console.log(serverConfig)
      this.serverService.updateServer(true, serverConfig, version)
      return true
    }
    throw new Error('server has not been initialized')
  }

  @Mutation(type => Boolean)
  async updateProductionServer(
    @Arg('version', { nullable: true }) version?: string
  ) {
    console.log('updateProductionServer')
    if (fs.existsSync(path.join(__dirname, 'production.serverconfig'))) {
      const info = fs.readFileSync(path.join(__dirname, 'production.serverconfig'), 'utf8')
      const serverConfig = JSON.parse(info) as InitServerInput
      console.log(`projectId`)
      console.log(serverConfig)
      this.serverService.updateServer(true, serverConfig, version)
      return true
    }
    throw new Error('server has not been initialized')
  }
}