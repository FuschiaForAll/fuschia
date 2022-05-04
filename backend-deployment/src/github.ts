// https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0

import { Octokit } from '@octokit/rest'
import { readFile } from 'fs-extra'
import path from 'path'
import globby from 'globby'
import sodium from 'tweetsodium';
import { DOCKERHUB_PASSWORD, DOCKERHUB_USERNAME } from './config';

const ORGANIZATION = 'FuschiaForAll'

interface GitBlob {
  path?: string | undefined
  mode?: '100644' | '100755' | '040000' | '160000' | '120000' | undefined
  type?: 'blob' | 'tree' | 'commit' | undefined
  sha?: string | null | undefined
  content?: string | undefined
}

async function AuthenticateWithGithub(token: string) {
  const octokit = new Octokit({
    auth: token,
  })
  return octokit
}

const createRepo = async (octo: Octokit, org: string, name: string) => {
  await octo.repos.createInOrg({ org, name, auto_init: true })
}

const uploadToRepo = async (
  octo: Octokit,
  coursePath: string,
  org: string,
  repo: string,
  branch: string = `develop`
) => {
  // gets commit's AND its tree's SHA
  const currentCommit = await getCurrentCommit(octo, org, repo, branch)
  const filesPaths = await globby(coursePath)
  const filesBlobs = await Promise.all(
    filesPaths.map(createBlobForFile(octo, org, repo))
  )
  const pathsForBlobs = filesPaths.map(fullPath =>
    path.relative(coursePath, fullPath)
  )
  const newTree = await createNewTree(
    octo,
    org,
    repo,
    filesBlobs,
    pathsForBlobs,
    currentCommit.treeSha
  )
  const commitMessage = `My commit message`
  const newCommit = await createNewCommit(
    octo,
    org,
    repo,
    commitMessage,
    newTree.sha,
    currentCommit.commitSha
  )
  await setBranchToCommit(octo, org, repo, branch, newCommit.sha)
}

const getCurrentCommit = async (
  octo: Octokit,
  org: string,
  repo: string,
  branch: string = 'main'
) => {
  const { data: refData } = await octo.git.getRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
  })
  const commitSha = refData.object.sha
  const { data: commitData } = await octo.git.getCommit({
    owner: org,
    repo,
    commit_sha: commitSha,
  })
  return {
    commitSha,
    treeSha: commitData.tree.sha,
  }
}

// Notice that readFile's utf8 is typed differently from Github's utf-8
const getFileAsUTF8 = (filePath: string) => readFile(filePath, 'utf8')

const createBlobForFile =
  (octo: Octokit, org: string, repo: string) => async (filePath: string) => {
    const content = await getFileAsUTF8(filePath)
    const blobData = await octo.git.createBlob({
      owner: org,
      repo,
      content,
      encoding: 'utf-8',
    })
    return blobData.data
  }

const createNewTree = async (
  octo: Octokit,
  owner: string,
  repo: string,
  blobs: GitBlob[],
  paths: string[],
  parentTreeSha: string
) => {
  // My custom config. Could be taken as parameters
  const tree = blobs.map(({ sha }, index) => ({
    path: paths[index],
    mode: `100644`,
    type: `blob`,
    sha,
  })) as GitBlob[]
  const { data } = await octo.git.createTree({
    owner,
    repo,
    tree,
    base_tree: parentTreeSha,
  })
  return data
}

const createNewCommit = async (
  octo: Octokit,
  org: string,
  repo: string,
  message: string,
  currentTreeSha: string,
  currentCommitSha: string
) =>
  (
    await octo.git.createCommit({
      owner: org,
      repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })
  ).data

const setBranchToCommit = (
  octo: Octokit,
  org: string,
  repo: string,
  branch: string = `develop`,
  commitSha: string
) =>
  octo.git.updateRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })
const createBranch = (
  octo: Octokit,
  org: string,
  repo: string,
  branch: string = `develop`,
  commitSha: string
) =>
  octo.git.createRef({
    owner: org,
    repo,
    ref: `refs/heads/${branch}`,
    sha: commitSha,
  })

async function AddGithubSecrets(
  octo: Octokit,
  org: string,
  repo: string,
  secrets: { [key: string]: string }
  ) {
    const publicKey = await octo.rest.actions.getRepoPublicKey({
      owner: org,
      repo
    })
    Promise.all(Object.keys(secrets).map(async key => {
      const messageBytes = Buffer.from(secrets[key]);
      const keyBytes = Buffer.from(publicKey.data.key, 'base64');

      const encryptedBytes = sodium.seal(messageBytes, keyBytes);
      const encrypted_value = Buffer.from(encryptedBytes).toString('base64');

      await octo.rest.actions.createOrUpdateRepoSecret({
        owner: org,
        repo,
        secret_name: key,
        encrypted_value,
        key_id: publicKey.data.key_id
      })
    }))
}

export async function CheckGithub(
  token: string,
  projectid: string,
  githubUrl?: string
) {
  const octokit = await AuthenticateWithGithub(token)
  const REPO = `${projectid}-server`
  const repos = await octokit.repos.listForOrg({
    org: ORGANIZATION,
  })
  if (!repos.data.map(repo => repo.name).includes(REPO)) {
    await createRepo(octokit, ORGANIZATION, REPO)
    const currentCommit = await getCurrentCommit(
      octokit,
      ORGANIZATION,
      REPO,
      'main'
    )
    await createBranch(
      octokit,
      ORGANIZATION,
      REPO,
      'develop',
      currentCommit.commitSha
    )
  }
  await AddGithubSecrets(octokit, ORGANIZATION, REPO, {
    DOCKERHUB_USERNAME,
    DOCKERHUB_PASSWORD
  })
  await uploadToRepo(octokit, `/tmp/${projectid}`, ORGANIZATION, REPO)
}
