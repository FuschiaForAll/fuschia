import { Octokit } from "@octokit/rest";

import { Command } from 'commander';
const program = new Command();

async function AuthenticateWithGithub() {
  const octokit = new Octokit({
    auth: ''
  })
  return octokit
}

interface JsonInputFile {
  githubToken: string
  mongoConnectionString: string
  githubUrl?: string
}

program
  .command('build')
  .argument('<payload>', 'the project structure')
  .action(async (payload) => {
    const parsed = JSON.parse(payload) as JsonInputFile
    console.log(parsed)
    console.log('build a project')
  });

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}