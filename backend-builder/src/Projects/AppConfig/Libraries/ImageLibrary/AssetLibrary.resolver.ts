import { mongoose } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  FieldResolver,
  Field,
  ObjectType,
  Subscription,
  Publisher,
  PubSub,
} from "type-graphql";
import { Service } from "typedi";
import { Context } from "../../../../types";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { S3Uploader } from "../../../../utils/s3-uploader";
import { ProjectService } from "../../../Project.service";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { AssetLibrary } from "./AssetLibrary.entity";
import { AssetModel, ProjectModel } from "../../../../Models";
import { Asset } from "./ImageFile/AssetFile.entity";

@ObjectType()
export class AssetSubscriptionPayload {
  @Field()
  type!: "CREATE" | "DELETE" | "UPDATE";
  @Field((type) => [ObjectIdScalar])
  _ids!: ObjectId[];
  @Field((type) => [Asset])
  assets!: Asset[];
}
@Service()
@Resolver((of) => AssetLibrary)
export class AssetLibraryResolver {
  constructor(
    private s3Uploader: S3Uploader,
    private projectService: ProjectService
  ) { }
  @Mutation((type) => Boolean)
  async uploadAsset(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("folder")
    folder: string,
    @Arg("file", () => GraphQLUpload)
    file: FileUpload,
    @PubSub("ASSET_CHANGE")
    publish: Publisher<AssetSubscriptionPayload>,
    @Ctx() ctx: Context
  ) {
    const { createReadStream, filename } = file;
    const project = await ProjectModel.findById(projectId);
    if (project) {
      const tempSplitFile = filename.split(".");
      const ext = (tempSplitFile.length > 1 ? "." + tempSplitFile.pop() : "")
        .toLowerCase()
        .trim();
      if ([".jpg", ".jpeg", ".gif", ".png"].includes(ext)) {
        const generatedFileName = filename;
        const tempPath = path.join("/tmp", generatedFileName);
        try {
          const fileStream = createReadStream();
          const writeStream = fs.createWriteStream(tempPath);

          let mimeType: string =
            "image/" +
            (ext === ".png" ? "png" : ext === ".gif" ? "gif" : "jpeg");
          await new Promise((resolve, reject) => {
            fileStream
              .pipe(writeStream)
              .on("finish", resolve)
              .on("error", reject);
          });
          const path = [];
          path.push(projectId);
          if (folder) {
            path.push(folder);
          }
          path.push(generatedFileName);
          await this.s3Uploader.uploadFile(tempPath, path.join("/"), mimeType);
          const createAsset = new AssetModel();
          createAsset.name = filename;
          path.shift();
          createAsset.key = path.join("/");
          if (!project.assetLibrary) {
            project.assetLibrary = new AssetLibrary();
          }
          createAsset.save();
          publish({
            type: "CREATE",
            _ids: [createAsset._id],
            assets: [createAsset],
          });
          project.assetLibrary.assets.push(createAsset._id);
          project.save();
        } catch (e) {
          console.error(e);
        } finally {
          await new Promise((resolve, reject) => {
            fs.unlink(tempPath, (err) => (err ? reject(err) : resolve(err)));
          });
        }
      }
      return true;
    }
  }

  @Mutation((type) => Boolean)
  async deleteAsset(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("imageId") imageId: string,
    @Ctx() ctx: Context
  ) {
    const project = await ProjectModel.findById(projectId);
    if (project && project.assetLibrary?.assets) {
      const asset = await AssetModel.findOne({
        where: { key: imageId }
      })
      if (asset) {
        const assetItem = project.assetLibrary.assets.find(item => item === asset._id)
        if (!assetItem) {
          throw new Error("Asset does not exist");
        }
        this.s3Uploader.deleteFile(asset.key)
        await AssetModel.findByIdAndDelete(assetItem)
        project.assetLibrary.assets = project.assetLibrary.assets.filter(item => item !== asset._id)
        await project.save()
        return true;
      }
    }
    return false;
  }

  @Mutation((type) => Boolean)
  async updateAssetMetaData(
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

  @FieldResolver()
  async assets(@Root() assetLibrary: AssetLibrary) {
    const fileIds = assetLibrary.assets;
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

  @Subscription((returns) => AssetSubscriptionPayload, {
    topics: "ASSET_CHANGE",
  })
  onAssetChange(
    @Root() assetSubscription: AssetSubscriptionPayload,
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: any
  ) {
    const returnedSub = { ...assetSubscription };
    // pub sub stringification messes up ObjectId and ObjectIdScalar
    // @ts-ignore
    returnedSub._ids = returnedSub._ids.map(
      // @ts-ignore
      (id) => new mongoose.Types.ObjectId(id)
    );
    // @ts-ignore
    returnedSub.assets = assetSubscription.assets.map((asset) => ({
      ...asset,
      // @ts-ignore
      _id: new mongoose.Types.ObjectId(asset._id),
    }));
    return returnedSub;
  }
}
