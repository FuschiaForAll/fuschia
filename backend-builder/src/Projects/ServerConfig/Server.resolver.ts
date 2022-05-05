import { ApolloError } from "apollo-server";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongoose";
import crypto from "crypto";
import { ProjectService } from "../Project.service";
import { ObjectIdScalar } from "../../utils/object-id.scalar";
import { Context } from "../../types";
import axios from 'axios'
import { DOCKERHUB_PASSWORD, DOCKERHUB_USERNAME } from "../../utils/config";
import { ProjectModel } from "../../Models";


export interface Tag {
  tag: string;
  is_current: boolean;
}

export interface Result {
  namespace: string;
  repository: string;
  digest: string;
  tags: Tag[];
  last_pushed: Date;
  last_pulled?: Date;
  status: string;
}

export interface ImagesResponse {
  count: number;
  next?: any;
  previous?: any;
  results: Result[];
}

@Service()
@Resolver()
export class ServerResolver {
  constructor(
    private projectService: ProjectService
  ) {}

  @Query(returns => [String])
  async getDockerhubVersions(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const response = await axios.post(`https://hub.docker.com/v2/users/login`, {
      "username": DOCKERHUB_USERNAME,
      "password": DOCKERHUB_PASSWORD
    },  {
        headers: {
          "Content-Type": "application/json",
        }
      })
    if (response.data) {
      const token = response.data.token
      
      const imagesResponse = await axios.get(`https://hub.docker.com/v2/namespaces/pragmaflowinc/repositories/${projectId}-server/images`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (imagesResponse.data) {
        const images = imagesResponse.data as ImagesResponse
        return images.results.flatMap(r => r.tags.filter(t => t.is_current).map(t => t.tag))
      }
    }
  }

  @Mutation(returns => Boolean)
  async updateServerVersion(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("sandbox") sandbox: boolean,
    @Arg("version") version: string,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const project = await ProjectModel.findById(projectId)
    if (project) {
      const response = await axios.post(`http://${project.serverConfig.ec2PublicDns}:3005/graphql`, {
        operationName: 'UpdateServerVersion',
        query: `
          mutation UpdateServerVersion {
            ${sandbox ? 'updateSandboxServer' : 'updateProductionServer' }(version: "${version}")
          }
        `
      },  {
          headers: {
            "Content-Type": "application/json",
          }
        })
        console.log(JSON.stringify(response.data, undefined, 2))
        return true;
    }
    return false;
  }
}
