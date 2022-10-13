import { functionBuilder, Hooks } from '../../src/CodeGen/app-builder/utils';
import { buildScreen } from '../../src/CodeGen/app-builder/code-gen';
import { Project } from '../../src/Projects/Project.entity';
import { expect } from 'chai';
import { assestFolder, packagesData, projectInfo,rootComponent,rootComponents, currentOutput, expectedOutput } from './data'

describe('test building a screen', () => {
  it('should output correctly', async () => {
    const fileString = await buildScreen(
      //@ts-ignore
      rootComponent,
      packagesData,
      rootComponents,
      projectInfo,
      assestFolder
    )
    expect(fileString).to.be.equal(expectedOutput)
  })
})