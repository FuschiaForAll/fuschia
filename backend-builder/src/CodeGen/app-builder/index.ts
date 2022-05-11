import { exec, execSync } from "child_process"
import { Service } from "typedi"
import { Package } from "../../Packages/Package.entity"
import { Component } from "../../Projects/AppConfig/Components/Component.entity"
import { Project } from "../../Projects/Project.entity"
import { DEFAULT_ORGANIZATION, GithubRepository } from "../utils/github"
import { CreateProject } from "./code-gen"
import fs from 'fs-extra'
import path from "path"

@Service()
export class AppBuilderService {
  public async KickoffNewBuild(
    project: Project, 
    components: Component[], 
    packages: Package[],  
    version: string, 
    githubToken: string, 
    expoToken: string, 
) {
    const repositoryName = `${project._id.toString()}-app`
    try {
      const repository = new GithubRepository(githubToken, repositoryName, DEFAULT_ORGANIZATION)
      const exists = await repository.CheckIfRepoExists()
      if (!exists) {
        console.log('initializing new repositiry')
        await repository.InitializeNewRepository()
        await repository.AddGithubSecrets({ expoToken })
        console.log('executing expo init')
        execSync(`cd /tmp/ && expo init --name ${repositoryName} --no-install --template expo-template-blank-typescript`)
        console.log('executing yarn import')
        execSync(`cd /tmp/${repositoryName} && npm install --package-lock-only; yarn import; rm package-lock.json`)
        console.log('executing upload to repositrory')
        await fs.ensureDir(path.join(`/tmp/${repositoryName}`, '.github'))
        await fs.ensureDir(path.join(`/tmp/${repositoryName}`, '.github', 'workflows'))
        const biolerplatedir = path.join(__dirname, 'boilerplate')
        await fs.copyFile(
          path.join(biolerplatedir, 'publish_eas_app.yaml'),
          path.join(`/tmp/${repositoryName}`, '.github', 'workflows', 'publish_eas_app.yaml')
        )
      
        await repository.UploadToRepo(path.join('/tmp/', repositoryName), 'develop', [
          `/tmp/${repositoryName}/.github/workflows/publish_eas_app.yaml`
        ])
      }
      console.log('executing create project')
      await CreateProject(project, components, packages, version)
      console.log('executing upload of project')
      await repository.UploadToRepo(path.join('/tmp/', repositoryName), 'develop', [])
    } catch (e) {
      console.error(e)
    } finally {
      console.log('cleaning up')
      await fs.rm(path.join('/tmp/', repositoryName), { recursive: true, force: true })
    }
  }
}