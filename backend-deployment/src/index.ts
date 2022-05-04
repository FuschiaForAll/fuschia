import { Command } from 'commander'
import { GenerateCode } from './code-gen'
import { JsonInputFile } from './types'
import fs from 'fs'
import path from 'path'
import { CheckGithub } from './github'
const program = new Command()

program
  .command('build')
  .argument('<payload>', 'the project structure')
  .option('-g, --github <token>', 'Github access token')
  .option('-k, --aws-key <key>', 'Aws key')
  .option('-s, --aws-secret <secret>', 'Aws secret token')
  .option('-e, --env <environment>', 'Environment')
  .option('-p, --project-id <projectid>', 'Project Id')
  .option('-v, --version <version>', 'New package version number')
  .action(async (payload, options) => {
    console.log('build a project')
    const parsed = JSON.parse(payload) as JsonInputFile
    console.log('generate code')
    await GenerateCode(parsed, options.projectId, options.version)
    console.log('upload to github')
    await CheckGithub(options.github, options.projectId, parsed.githubUrl)
    console.log('complete')
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
