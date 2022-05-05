import { Field, InputType } from "type-graphql";

@InputType()
export class InitServerInput {
  @Field()
  projectId!: string

  @Field()
  sessionSecret!: string

  @Field({ nullable: true })
  mongoDbConnectionString!: string

  @Field({ nullable: true })
  databaseName!: string

  @Field({ nullable: true })
  redisUrl!: string

  @Field({ nullable: true })
  redisPort!: number

  @Field({ nullable: true })
  serverPort!: number

  @Field({ nullable: true })
  fileStorageType!: string

  @Field({ nullable: true })
  s3AccessKey!: string
  
  @Field({ nullable: true })
  s3secret!: string
  
  @Field({ nullable: true })
  s3BucketName!: string

  @Field({ nullable: true })
  appEndpoint!: string

  @Field({ nullable: true })
  emailConfigType!: string

  @Field({ nullable: true })
  fromEmailAddress!: string

  @Field({ nullable: true })
  emailHost!: string

  @Field({ nullable: true })
  emailPort!: string

  @Field({ nullable: true })
  emailUser!: string

  @Field({ nullable: true })
  emailPassword!: string
}