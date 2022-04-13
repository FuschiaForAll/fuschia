import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Context } from "../../../../types";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { S3Uploader } from "../../../../utils/s3-uploader";
import { ProjectService } from "../../../Project.service";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { ImageLibrary } from "./ImageLibrary.entity";
import { ProjectModel } from "../../../../Models";
import { ImageFile } from "./ImageFile/ImageFile.entity";

@Service()
@Resolver((of) => ImageLibrary)
export class ImageLibraryResolver {
  constructor(
    private s3Uploader: S3Uploader,
    private projectService: ProjectService
  ) {}
  @Mutation((type) => Boolean)
  async uploadImage(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
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
}
