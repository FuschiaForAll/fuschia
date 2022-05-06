import { Service } from "typedi"
import { Package } from "../../Packages/Package.entity"
import { Component } from "../../Projects/AppConfig/Components/Component.entity"
import { Project } from "../../Projects/Project.entity"
import { CheckGithub } from "../utils/github"
import { CreateProject } from "./code-gen"

@Service()
export class AppBuilderService {
  public async KickoffNewBuild(
    project: Project, 
    components: Component[], 
    packages: Package[],  
    version: string, 
    githubToken: string, 
    dockerhubUsername: string, 
    dockerhubPassword: string
) {
    try {
      await CreateProject(project, components, packages, version)
      await CheckGithub(githubToken, project._id.toString(), dockerhubUsername, dockerhubPassword, 'app', [])
    } catch (e) {
      console.error(e)
    } 
  }
}