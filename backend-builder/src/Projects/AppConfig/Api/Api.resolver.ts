import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../../types";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { ApiService } from "./Api.service";
import { ProjectService } from "../../Project.service";
import { ApolloError } from "apollo-server";
import { ProjectModel } from "../../../Models";
import { Service } from "typedi";
import { spawn } from "child_process";
import portfinder from "portfinder";
import { MONGO_DB_URL } from "../../../utils/config";
import axios from 'axios'
import kill from 'tree-kill'

function spawnInstance(
  environment: string,
  mongoUrl: string,
  projectId: string,
  port: string
) {
  console.log(`${__dirname}/../../../../../backend-runner/src/index.js`)
  const child = spawn("node", [`${__dirname}/../../../../../backend-runner/src/index.js`], {
    env: {
      ...process.env,
      NODE_ENV: environment,
      MONGO_DB_URL: mongoUrl,
      PROJECT_ID: projectId,
      PORT: port,
    },
  });

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
      console.log("stdout: " + data);
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
      console.log("stderr: " + data);
    });
    return child.pid
}

type pid = number

@Service()
@Resolver()
export class ApiResolver {
  // this is for temp development only and should be moved to AWS ECS local containers
  processes: { [projectId: string]: pid} = {};
  constructor(
    private apiService: ApiService,
    private projectService: ProjectService
  ) {
  }
  @Mutation(() => Boolean)
  async publishApi(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("sandbox") sandbox: Boolean,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const project = await ProjectModel.findById(projectId);
    if (project) {
      if (sandbox) {
        if (project.appConfig.apiConfig.sandboxEndpoint) {
          if (this.processes[projectId.toString()]) {
            await new Promise((resolve, reject) => {
              kill(this.processes[projectId.toString()], 'SIGKILL', e => {
                resolve(true)
              })
            })
            delete this.processes[projectId.toString()]
          }
          const url = new URL(project.appConfig.apiConfig.sandboxEndpoint)
          const pid = spawnInstance("test", MONGO_DB_URL, project._id.toString(), url.port);
          if (pid) {
            this.processes[`${projectId.toString()}`] = pid
          }
        } else {
          // temp for now, it will actually cause problems if an api is offline but the server is started.
          const openPort = await portfinder.getPortPromise();
          project.appConfig.apiConfig.sandboxEndpoint = `http://localhost:${openPort}`;
          project.save();
          const pid = spawnInstance(
            "test",
            MONGO_DB_URL,
            project._id.toString(),
            `${openPort}`
          );
          if (pid) {
            this.processes[`${projectId.toString()}`] = pid
          }
          return true;
        }
      } else {
        if (project.appConfig.apiConfig.liveEndpoint) {
            const url = new URL(project.appConfig.apiConfig.sandboxEndpoint)
          spawnInstance("prod", MONGO_DB_URL, project._id.toString(), url.port);
        } else {
          const openPort = await portfinder.getPortPromise();
          project.appConfig.apiConfig.liveEndpoint = `http://localhost:${openPort}`;
          project.save();
          spawnInstance(
            "prod",
            MONGO_DB_URL,
            project._id.toString(),
            `${openPort}`
          );
          return true;
        }
      }
    }
    return true;
  }

  @Query(() => Boolean)
  async getServerStatus(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("sandbox") sandbox: Boolean
  ) {
    const project = await ProjectModel.findById(projectId);
    if (project) {
      if (sandbox && project.appConfig.apiConfig.sandboxEndpoint) {
        try {
          const response = await axios.post(project.appConfig.apiConfig.sandboxEndpoint, {
            operationName: 'Introspection',
            query: `
              query Introspection {
                __schema {
                  types {
                    name
                  }
                }
              }
            `
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          return true
        } catch  {
        }
        return false
      } else if (!sandbox && project.appConfig.apiConfig.liveEndpoint) {
        try {
          const response = await axios.post(project.appConfig.apiConfig.liveEndpoint, {
            operationName: 'Introspection',
            query: `
              query Introspection {
                __schema {
                  types {
                    name
                  }
                }
              }
            `
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          return true
        } catch {
        }
        return false
      }
    }
    return false
  }

  @Mutation(() => Boolean, { nullable: true })
  async createRelationship(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveRelationship(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async listRelationships(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateRelationship(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteRelationship(@Ctx() ctx: Context) {
    return true;
  }

  @Mutation(() => Boolean, { nullable: true })
  async createQuery(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveQuery(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async listQueries(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateQuery(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteQuery(@Ctx() ctx: Context) {
    return true;
  }

  @Mutation(() => Boolean, { nullable: true })
  async createMutation(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveMutation(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async listMutations(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateMutation(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteMutations(@Ctx() ctx: Context) {
    return true;
  }

  @Mutation(() => Boolean, { nullable: true })
  async createSubscription(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async retrieveSubscription(@Ctx() ctx: Context) {
    return true;
  }
  @Query(() => Boolean, { nullable: true })
  async listSubscriptions(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateSubscription(@Ctx() ctx: Context) {
    return true;
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteSubscription(@Ctx() ctx: Context) {
    return true;
  }
}
