import { Service } from "typedi";
import { ProjectModel } from "../../../Models";
import { Project } from "../../Project.entity";
import { ModelSizeInput, ModelAttributeTypes, ModelStringInput, ModelBooleanInput, ModelSortDirection } from "./Api.consts";
import { spawn } from 'child_process'

interface GenerateInputParams {
  typename: string
  keys: Array<{
    fieldName: string,
    dataType: 'ID' | 'String' | 'Boolean' | 'Int'
  }>,
}


function checkTypeForPrimitive(type: string) {
  switch (type) {
    case 'ID':
    case 'String':
    case 'Boolean':
    case 'Int':
    case 'Float':
      return true
  }
  return false
}

@Service()
export class ApiService {

  public publish(project: Project, sandbox?: Boolean) {
    // for now let's just spin up an instance
    console.log("spawning API")
    spawn( 'node', ['/mnt/c/work/fuschia/backend-runner/src/index.js'], { env: { ...process.env, NODE_ENV: 'test', MONGO_DB_URL:'mongodb://localhost:27017', PROJECT_ID: project._id.toString()  } })
    
    if (sandbox) {
      if (project.appConfig.apiConfig.sandboxEndpoint) {
        // version, destroy, and restart
      } else {

      }
    } else {
      if (project.appConfig.apiConfig.liveEndpoint) {
        // version, destroy and restart
      } else {

      }
    }

  }
}