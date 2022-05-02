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
import {
  GITHUB_API_KEY,
  MONGO_DB_URL,
  S3_ACCESS_KEY,
  S3_SECRET,
} from "../../../utils/config";
import axios from "axios";
import kill from "tree-kill";

interface AWSGetRequest {
  endpoint: string;
  action: "RunInstance";
}

function spawnInstance(
  environment: string,
  payload: string,
  githubToken: string,
  awsKey: string,
  awsSecret: string,
  projectId: string
) {
  // check if local or remove and either spawn instance or call AWS
  const child = spawn("npx", [
    "ts-node",
    `${__dirname}/../../../../../backend-deployment/src/index.ts`,
    `build`,
    `${payload}`,
    `--github`,
    `${githubToken}`,
    `--aws-key`,
    `${awsKey}`,
    `--aws-secret`,
    `${awsSecret}`,
    `--env`,
    `${environment}`,
    `--project-id`,
    `${projectId}`,
  ]);

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", function (data) {
    console.log("stdout: " + data);
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", function (data) {
    console.log("stderr: " + data);
  });
  return child.pid;
}

type pid = number;

@Service()
@Resolver()
export class ApiResolver {
  // this is for temp development only and should be moved to AWS ECS local containers
  processes: { [projectId: string]: pid } = {};
  constructor(
    private apiService: ApiService,
    private projectService: ProjectService
  ) {}
  @Mutation(() => Boolean)
  async publishApi(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("sandbox") sandbox: Boolean,
    @Ctx() ctx: Context
  ) {
    // if (
    //   !ctx.req.session.userId ||
    //   !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    // ) {
    //   throw new ApolloError("Unauthorized");
    // }
    const project = await ProjectModel.findById(projectId);
    if (project) {
      // connect with Github and AWS
      const projectConfig = JSON.stringify(project.serverConfig);
      spawnInstance(
        sandbox ? "test" : "prod",
        projectConfig,
        GITHUB_API_KEY,
        S3_ACCESS_KEY,
        S3_SECRET,
        projectId.toString()
      );
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
      if (sandbox && project.serverConfig.apiConfig.sandboxEndpoint) {
        try {
          const response = await axios.post(
            project.serverConfig.apiConfig.sandboxEndpoint,
            {
              operationName: "Introspection",
              query: `
              query Introspection {
                __schema {
                  types {
                    name
                  }
                }
              }
            `,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return true;
        } catch {}
        return false;
      } else if (!sandbox && project.serverConfig.apiConfig.liveEndpoint) {
        try {
          const response = await axios.post(
            project.serverConfig.apiConfig.liveEndpoint,
            {
              operationName: "Introspection",
              query: `
              query Introspection {
                __schema {
                  types {
                    name
                  }
                }
              }
            `,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return true;
        } catch {}
        return false;
      }
    }
    return false;
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
