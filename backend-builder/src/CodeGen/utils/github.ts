// https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0

import { Octokit } from '@octokit/rest'
import { readFile } from 'fs-extra'
import path from 'path'
import globby from 'globby'
import sodium from 'tweetsodium';

export const DEFAULT_ORGANIZATION = 'FuschiaForAll'

interface GitBlob {
  path?: string | undefined
  mode?: '100644' | '100755' | '040000' | '160000' | '120000' | undefined
  type?: 'blob' | 'tree' | 'commit' | undefined
  sha?: string | null | undefined
  content?: string | undefined
}

export class GithubRepository {
  private octokit: Octokit
  constructor(
    private token: string, 
    private repository: string,
    private organization: string) {
      this.octokit = new Octokit({
        auth: this.token
      })
    }
  static getFileAsUTF8 = (filePath: string) => readFile(filePath, 'utf8')

  public async CheckIfRepoExists() {
    const repos = await this.octokit.repos.listForOrg({
      org: this.organization,
    })
    return repos.data.map(repo => repo.name).includes(this.repository)
  }

  public async InitializeNewRepository() {
    await this.createRepo()
    // the first time we create a repo we need to initialize RN and Expo
    const currentCommit = await this.GetCurrentCommit('main')
    await this.createBranch('develop', currentCommit.commitSha)
  }
  public async UploadToRepo(
    coursePath: string,
    branch: string = `develop`,
    additionalFiles: string[]
  ) {
    // gets commit's AND its tree's SHA
    const currentCommit = await this.GetCurrentCommit(branch)
    const filesPaths = await globby(coursePath)
    console.log(`\n\n\nHEREHEREHERE!!!!\n\n\n`);
    console.log(coursePath);
    const filesBlobs = await Promise.all(
      filesPaths.map(file => this.createBlobForFile(file))
    )
    await Promise.all(additionalFiles.map(async file => filesBlobs.push(await this.createBlobForFile(file))))
    
    const pathsForBlobs = filesPaths.map(fullPath =>
      path.relative(coursePath, fullPath)
    )
    additionalFiles.forEach(file => pathsForBlobs.push(path.relative(coursePath, file)))
    
    const newTree = await this.createNewTree(
      filesBlobs,
      pathsForBlobs,
      currentCommit.treeSha
    )
    const commitMessage = `My commit message`
    const newCommit = await this.createNewCommit(
      commitMessage,
      newTree.sha,
      currentCommit.commitSha
    )
    await this.setBranchToCommit(branch, newCommit.sha)
  }

  private async createBlobForFile(filePath: string) {
    const content = await GithubRepository.getFileAsUTF8(filePath)
    const blobData = await this.octokit.git.createBlob({
      owner: this.organization,
      repo: this.repository,
      content,
      encoding: 'utf-8',
    })
    return blobData.data
  }

  private async createRepo() {
    await this.octokit.repos.createInOrg({ org: this.organization, name: this.repository, auto_init: true })
  }
  
  public async GetCurrentCommit(
    branch: string = 'main'
  ) {
    const { data: refData } = await this.octokit.git.getRef({
      owner: this.organization,
      repo: this.repository,
      ref: `heads/${branch}`,
    })
    const commitSha = refData.object.sha
    const { data: commitData } = await this.octokit.git.getCommit({
      owner: this.organization,
      repo: this.repository,
      commit_sha: commitSha,
    })
    return {
      commitSha,
      treeSha: commitData.tree.sha,
    }
  }

  private async createNewTree (
    blobs: GitBlob[],
    paths: string[],
    parentTreeSha: string
  ) {
    // My custom config. Could be taken as parameters
    const tree = blobs.map(({ sha }, index) => ({
      path: paths[index],
      mode: `100644`,
      type: `blob`,
      sha,
    })) as GitBlob[]
    const { data } = await this.octokit.git.createTree({
      owner: this.organization,
      repo: this.repository,
      tree,
      base_tree: parentTreeSha,
    })
    return data
  }
  
  private async createNewCommit(
    message: string,
    currentTreeSha: string,
    currentCommitSha: string
  ){
    const newCommit = await this.octokit.git.createCommit({
        owner: this.organization,
        repo: this.repository,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      })
    return newCommit.data
  }
  private async setBranchToCommit(
    branch: string = `develop`,
    commitSha: string
  ) {
    this.octokit.git.updateRef({
      owner: this.organization,
      repo: this.repository,
      ref: `heads/${branch}`,
      sha: commitSha,
    })
  }
  private async createBranch(
    branch: string = `develop`,
    commitSha: string
  ){
    return this.octokit.git.createRef({
      owner: this.organization,
      repo: this.repository,
        ref: `refs/heads/${branch}`,
        sha: commitSha,
      })
  }
  
  public async AddGithubSecrets(
    secrets: { [key: string]: string }
    ) {
      const publicKey = await this.octokit.rest.actions.getRepoPublicKey({
        owner: this.organization,
        repo: this.repository,
      })
      Promise.all(Object.keys(secrets).map(async key => {
        const messageBytes = Buffer.from(secrets[key]);
        const keyBytes = Buffer.from(publicKey.data.key, 'base64');
  
        const encryptedBytes = sodium.seal(messageBytes, keyBytes);
        const encrypted_value = Buffer.from(encryptedBytes).toString('base64');
  
        await this.octokit.rest.actions.createOrUpdateRepoSecret({
          owner: this.organization,
          repo: this.repository,
          secret_name: key,
          encrypted_value,
          key_id: publicKey.data.key_id
        })
      }))
  }
}


// Notice that readFile's utf8 is typed differently from Github's utf-8



// export async function CheckGithub(
//   token: string,
//   projectid: string,
//   dockerhubUsername: string,
//   dockerhubPassword: string,
//   projectType: string,
//   additionalFiles: string[],
//   projectName?: string
// ) {
//   const octokit = await AuthenticateWithGithub(token)
//   const REPO = `${projectid}-${projectType}`
//   const exists = CheckIfRepoExists(octokit, REPO)
//   if (!exists) {
//     InitializeNewRepository(octokit, REPO)
//   }
//   await AddGithubSecrets(octokit, ORGANIZATION, REPO, {
//     dockerhubUsername,
//     dockerhubPassword
//   })
//   await uploadToRepo(octokit, `/tmp/${projectid}-${projectType}`, ORGANIZATION, REPO, 'develop', additionalFiles)
// }
