import { Service } from "typedi"
import { Project } from "../../Projects/Project.entity"
import { DEFAULT_ORGANIZATION, GithubRepository } from "../utils/github"
import { GenerateCode } from "./code-gen"

@Service()
export class ServerBuilderService {
  public async KickoffNewBuild(
    project: Project, 
    version: string, 
    githubToken: string, 
    dockerhubUsername: string, 
    dockerhubPassword: string
) {
  const repositoryName = `${project._id.toString()}-server`
  const repository = new GithubRepository(githubToken, repositoryName, DEFAULT_ORGANIZATION)
  const exists = await repository.CheckIfRepoExists()
  if (!exists) {
    await repository.InitializeNewRepository()
    await repository.AddGithubSecrets({ dockerhubUsername, dockerhubPassword })
  }
    await GenerateCode(project, project._id.toString(), version)
    await repository.UploadToRepo(repositoryName, 'develop', [`/tmp/${project._id.toString()}-server/.github/workflows/deploy_test_server.yaml`])
    console.log('completed')
  }
}