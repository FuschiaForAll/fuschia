import { Service } from "typedi"
import { Project } from "../../Projects/Project.entity"
import { CheckGithub } from "../utils/github"
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
    console.log('generating code')
    await GenerateCode(project, project._id.toString(), version)
    console.log('checking github')
    await CheckGithub(githubToken, project._id.toString(), dockerhubUsername, dockerhubPassword, 'server',
    [`/tmp/${project._id.toString()}-server/.github/workflows/deploy_test_server.yaml`])
    console.log('completed')
  }
}