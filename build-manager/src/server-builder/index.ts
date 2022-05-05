import { Service } from "typedi"
import { ServerBuilderInput } from "../graphql/server-builder.input"
import { CheckGithub } from "../utils/github"
import { GenerateCode } from "./code-gen"
import { JsonInputFile } from "./types"

@Service()
export class ServerBuilderService {
  public async KickoffNewBuild(
    input: ServerBuilderInput,
) {
  const { project, projectId, version, githubToken, dockerhubUsername, dockerhubPassword } = input
    await GenerateCode(project, projectId, version)
    await CheckGithub(githubToken, projectId, dockerhubUsername, dockerhubPassword, 'server')
  }
}