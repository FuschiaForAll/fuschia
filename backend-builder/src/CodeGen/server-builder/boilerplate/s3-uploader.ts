import AWS from 'aws-sdk'
import { Service } from 'typedi'
import { S3_SECRET, S3_ACCESS_KEY, S3_BUCKET_NAME } from './config'
import fs from 'fs'
import { Response } from 'express-serve-static-core'

@Service()
export class S3Uploader {
  private s3: AWS.S3
  constructor() {
    const credentials = new AWS.Credentials(S3_ACCESS_KEY, S3_SECRET)
    AWS.config.credentials = credentials
    AWS.config.region = 'ca-central-1'
    this.s3 = new AWS.S3()
  }

  public async uploadFile(source: string, target: string, mimeType?: string) {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(source)
      fileStream.on('error', error => reject(error))
      const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: target,
        Body: fileStream,
        ContentType: mimeType,
      }
      this.s3.upload(
        uploadParams,
        (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (error) {
            reject(error)
          }
          if (data) {
            resolve(data)
          }
        }
      )
    })
  }

  public async deleteFile(target: string) {
    if (!target) {
      return
    }
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: target,
      }
      this.s3.deleteObject(
        params,
        (error: Error, data: AWS.S3.DeleteObjectOutput) => {
          if (error) {
            reject(error)
          }
          if (data) {
            resolve(data)
          }
        }
      )
    })
  }

  public async getFile(key: string, res: Response) {
    this.s3
      .getObject({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      })
      .createReadStream()
      .on('error', console.error)
      .pipe(res)
  }

  public async createFolder(folderName: string) {
    return this.s3
      .putObject({
        Bucket: S3_BUCKET_NAME,
        Key: folderName,
      })
      .promise()
  }

  public async listFolder(folderName: string) {
    return this.s3
      .listObjectsV2({
        Bucket: S3_BUCKET_NAME,
        Prefix: folderName,
      })
      .promise()
  }
}
