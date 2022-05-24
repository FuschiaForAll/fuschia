import { exec, execSync } from "child_process"
import { Service } from "typedi"
import { Package } from "../../Packages/Package.entity"
import { Component } from "../../Projects/AppConfig/Components/Component.entity"
import { Project } from "../../Projects/Project.entity"
import { DEFAULT_ORGANIZATION, GithubRepository } from "../utils/github"
import { CreateProject } from "./code-gen"
import fs from 'fs-extra'
import path from "path"

const defaultDevPackages = [
  '@graphql-codegen/cli',
  '@graphql-codegen/typescript',
  '@graphql-codegen/typescript-operations',
  '@graphql-codegen/typescript-react-apollo',
  '@graphql-codegen/typescript-urql',
  'prettier'
]
const defaultPackages = [
  '@react-native-async-storage/async-storage',
  '@react-navigation/native',
  '@react-navigation/stack',
  '@fuchsia-for-all/primitives',
  '@apollo/client',
  'core-js',
  'react-native-gesture-handler',
  'react-native-safe-area-context'
]

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
      }
      console.log('executing expo init')
      execSync(`cd /tmp/ && expo init --name ${repositoryName} --no-install --template expo-template-blank-typescript`)
      console.log('executing yarn import')
      execSync(`cd /tmp/${repositoryName} && npm install ${defaultPackages.join(' ')} --package-lock-only`)
      execSync(`cd /tmp/${repositoryName} && npm install ${defaultDevPackages.join(' ')} --package-lock-only --save-dev`)
      execSync(`cd /tmp/${repositoryName} && npm install --package-lock-only; yarn import; rm package-lock.json`)

      // update app.json for Expo
      const expoAppJson = JSON.parse(fs.readFileSync(path.join(`/tmp`, repositoryName, 'app.json'), 'utf-8'))
      console.log(`expoAppJson`)
      console.log(expoAppJson)
      if (expoAppJson.expo) {
        expoAppJson.expo.owner = 'fuchsia-for-all'
      } else {
        console.error(`something went terribly wrong, there is no expo config`)
      }
      console.log('writing app.json')
      fs.writeFileSync(path.join(`/tmp`, repositoryName, 'app.json'), JSON.stringify(expoAppJson,  null, 2))

      // update package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(`/tmp`, repositoryName, 'package.json'), 'utf-8'))
      console.log(`packageJson`)
      console.log(packageJson)
      packageJson.version = version
      packageJson.scripts.gen = "graphql-codegen --config codegen.yml"
      packageJson.scripts.lint = "eslint ."
      packageJson.scripts.format = "prettier --write '**/*.js'"
      console.log('writing package.json')
      fs.writeFileSync(path.join(`/tmp`, repositoryName, 'package.json'), JSON.stringify(packageJson,  null, 2))
      execSync(`cat /tmp/${repositoryName}/package.json`)
      console.log('executing upload to repositrory')
      await fs.ensureDir(path.join(`/tmp`, repositoryName, '.github'))
      await fs.ensureDir(path.join(`/tmp`, repositoryName, '.github', 'workflows'))
      const biolerplatedir = path.join(__dirname, 'boilerplate')
      await fs.copyFile(
        path.join(biolerplatedir, 'publish_eas_app.yaml'),
        path.join(`/tmp`, repositoryName, '.github', 'workflows', 'publish_eas_app.yaml')
      )
      await fs.copyFile(
        path.join(biolerplatedir, 'codegen.yml'),
        path.join(`/tmp`, repositoryName, 'codegen.yml')
      )
      console.log('executing create project')
      await CreateProject(project, components, packages, version)
      console.log('executing upload of project')
      await repository.UploadToRepo(path.join('/tmp', repositoryName), 'develop', [`/tmp/${repositoryName}/.github/workflows/publish_eas_app.yaml`])
    } catch (e) {
      console.error(e)
    } finally {
      console.log('cleaning up')
      await fs.rm(path.join('/tmp', repositoryName), { recursive: true, force: true })
    }
  }
}