import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Service } from "typedi";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { Context } from "../../../../../types";
import { ProjectModel } from "../../../../../Models";
import { ObjectIdScalar } from "../../../../../utils/object-id.scalar";
import { S3Uploader } from "../../../../../utils/s3-uploader";
import { ProjectService } from "../../../../Project.service";
import { ImageLibrary } from "../ImageLibrary.entity";
import { ImageFile } from "./ImageFile.entity";

@ObjectType()
export default class File {
  @Field()
  key!: string;

  @Field()
  type!: string;
}

@Service()
@Resolver()
export class ImageFileResolver {
  constructor(
    private s3Uploader: S3Uploader,
    private projectService: ProjectService
  ) {}
  @Mutation((type) => Boolean)
  async uploadImage(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("folder") folder: string,
    @Arg("image", () => GraphQLUpload)
    uploadFile: FileUpload,
    @Ctx() ctx: Context
  ) {
    const { createReadStream, filename } = uploadFile;
    const project = await ProjectModel.findById(projectId);
    if (project) {
      const tempSplitFile = filename.split(".");
      const ext = (tempSplitFile.length > 1 ? "." + tempSplitFile.pop() : "")
        .toLowerCase()
        .trim();
      if ([".jpg", ".jpeg", ".gif", ".png"].includes(ext)) {
        const generatedFileName = `${projectId}.${uuid()}${ext}`;
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
          await this.s3Uploader.uploadFile(
            tempPath,
            generatedFileName,
            mimeType
          );
          const createImage = new ImageFile();
          createImage.name = filename;
          createImage.key = generatedFileName;
          if (!project.imageLibrary) {
            project.imageLibrary = new ImageLibrary();
          }
          project.imageLibrary.images.push(createImage);
          project.save();
        } catch (e) {
          console.error(e);
        } finally {
          await new Promise((resolve, reject) => {
            fs.unlink(tempPath, (err) => (err ? reject(err) : resolve(err)));
          });
        }
      }
    }
  }

  @Mutation((type) => Boolean)
  async deleteImage(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("imageId", (type) => ObjectIdScalar) imageId: ObjectId,
    @Ctx() ctx: Context
  ) {
    throw new Error("Not Implemented");
  }

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
  public async createImageFolder(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("folderName") folderName: string
  ) {
    return this.s3Uploader.createFolder(`${projectId}/${folderName}`);
  }

  @Query((type) => [File])
  public async listImageFolder(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("folderName") folderName: string
  ) {
    const files = await this.s3Uploader.listFolder(`${projectId}${folderName}`);
    let retArray: any[] = [];
    if (files.Contents) {
      retArray = files.Contents.map((content) => ({
        key: content.Key,
        type: content.Key?.endsWith("/") ? "folder" : "file",
      }));
    }
    return retArray;
  }
}
