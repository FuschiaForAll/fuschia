import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  Query,
  Resolver,
} from "type-graphql";
import { Service } from "typedi";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { Context } from "../../../../../types";
import { AssetModel, ProjectModel } from "../../../../../Models";
import { ObjectIdScalar } from "../../../../../utils/object-id.scalar";
import { S3Uploader } from "../../../../../utils/s3-uploader";
import { ProjectService } from "../../../../Project.service";
import { AssetLibrary } from "../AssetLibrary.entity";
import { Asset } from "./AssetFile.entity";
import { AssetSubscriptionPayload } from "../AssetLibrary.resolver";

@Service()
@Resolver()
export class AssetResolver {
  constructor(
    private s3Uploader: S3Uploader,
    private projectService: ProjectService
  ) {}

  @Mutation((type) => Boolean)
  async updateImageMetaData(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    throw new Error("Not Implemented");
  }

  @Mutation((type) => Boolean)
  public async createAssetFolder(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("folderName") folderName: string,
    @PubSub("ASSET_CHANGE")
    publish: Publisher<AssetSubscriptionPayload>
  ) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (project) {
        this.s3Uploader.createFolder(`${projectId}/${folderName}`);
        const createAsset = new AssetModel();
        createAsset.name = folderName;
        createAsset.key = folderName;
        if (!project.assetLibrary) {
          project.assetLibrary = new AssetLibrary();
        }
        project.assetLibrary.assets.push((await createAsset.save())._id);
        publish({
          type: "CREATE",
          _ids: [createAsset._id],
          assets: [createAsset],
        });
        project.save();
        return true;
      }
    } catch (e) {}
    return false;
  }

  @Query((type) => [Asset])
  public async listAssetFolder(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId
  ) {
    const project = await ProjectModel.findById(projectId);
    const fileIds = project?.assetLibrary?.assets;
    if (fileIds) {
      const files = await AssetModel.find({ _id: fileIds });
      return files.map((f) => ({
        _id: f._id,
        key: f.key,
        name: f.name,
        type: f.key.endsWith("/") ? "folder" : "file",
      }));
    }
  }
}
