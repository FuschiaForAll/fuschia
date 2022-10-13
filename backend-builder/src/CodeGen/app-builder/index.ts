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
  { packageName: '@babel/core', version: '7.12.9' },
  { packageName: '@graphql-codegen/cli', version: '2.6.2' },
  { packageName: '@graphql-codegen/typescript', version: '2.4.11' },
  { packageName: '@graphql-codegen/typescript-operations', version: '2.4.0' },
  { packageName: '@graphql-codegen/typescript-react-apollo', version: '3.2.14' },
  { packageName: '@graphql-codegen/typescript-urql', version: '3.5.10' },
  { packageName: '@graphql-codegen/typescript-urql', version: '3.5.10' },
  { packageName: '@types/react', version: '17.0.21' },
  { packageName: '@types/react-native', version: '0.66.13' },
  { packageName: 'prettier', version: '' },
  { packageName: 'typescript', version: '4.3.5' }
]
const defaultPackages = [
  { packageName: "@apollo/client", version: "3.6.5" },
  { packageName: "@fuchsia-for-all/primitives", version: "1.0.8" },
  { packageName: "@react-native-async-storage/async-storage" , version: "1.17.3" },
  { packageName: "@react-navigation/native", version:"6.0.10" },
  { packageName: "@react-navigation/stack", version: "6.2.1" },
  { packageName: "core-js", version: "3.22.7" },
  { packageName: "expo", version: "45.0.0" },
  { packageName: "expo-status-bar", version: "~1.3.0" },
  { packageName: "react", version: "17.0.2" },
  { packageName: "react-dom", version: "17.0.2" },
  { packageName: "react-native", version: "0.68.2" },
  { packageName: "react-native-gesture-handler", version: "2.2.1" },
  { packageName: "react-native-safe-area-context", version: "4.2.4" },
  { packageName: "react-native-web", version: "0.17.7" },
  { packageName: "react-native-reanimated", version: "2.9.1"},
  { packageName: "react-native-screens", version: "3.15.0"}
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
      execSync(`cd /tmp/ && expo init ${repositoryName} --no-install --template expo-template-blank-typescript`)

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
      packageJson.scripts.format = "prettier --write '**/*.ts'"
      defaultPackages.forEach(p => packageJson.dependencies[p.packageName] = p.version)
      defaultDevPackages.forEach(p => packageJson.devDependencies[p.packageName] = p.version)
      console.log('writing package.json')
      fs.writeFileSync(path.join(`/tmp`, repositoryName, 'package.json'), JSON.stringify(packageJson,  null, 2))
      execSync(`cd /tmp/${repositoryName} && npm install --package-lock-only; yarn import; rm package-lock.json`)
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
      await fs.copyFile(
        path.join(biolerplatedir, 'gitignore.template'),
        path.join(`/tmp`, repositoryName, '.gitignore')
      )
      console.log('executing create project')
      await CreateProject(project, components, packages, version)
      console.log('executing upload of project')
      await repository.UploadToRepo(path.join('/tmp', repositoryName), 'develop', [`/tmp/${repositoryName}/.github/workflows/publish_eas_app.yaml`, `/tmp/${repositoryName}/.gitignore`])
    } catch (e) {
      console.error(e)
    } finally {
      console.log('cleaning up')
      await fs.rm(path.join('/tmp', repositoryName), { recursive: true, force: true })
    }
  }
}