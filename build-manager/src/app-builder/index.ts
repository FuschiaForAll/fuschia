import { Service } from "typedi"
import { AppBuilderInput } from "../graphql/app-builder.input"
import { ServerBuilderInput } from "../graphql/server-builder.input"
import { CheckGithub } from "../utils/github"
import { CreateProject } from "./code-gen"

@Service()
export class AppBuilderService {
  public async KickoffNewBuild(
    input: AppBuilderInput,
) {
  const { project, components, packages, projectId, version, githubToken, dockerhubUsername, dockerhubPassword } = input
    await CreateProject(project, components, packages, version)
    await CheckGithub(githubToken, projectId, dockerhubUsername, dockerhubPassword, 'app')
  }
}