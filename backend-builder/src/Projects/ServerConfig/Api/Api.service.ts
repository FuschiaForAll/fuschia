import AWS from "aws-sdk";
import { Service } from "typedi";
import { ProjectModel } from "../../../Models";
import axios from "axios";
import { ObjectId } from "mongodb";


const RETRY_COUNT = 20
@Service()
export class ApiService {
  public async generateCodeAndPushToGithub() {
    // TODO: Move this to it's own microservice

  }

  public async createEC2Instance(projectId: string, instanceType: string, availabilityZone: string) {
    const ami = new AWS.EC2()
    const reservation = await new Promise<AWS.EC2.Reservation>((resolve, reject) => {
      ami.runInstances({
        ImageId: "ami-0c02c0a530c07ed50", 
        InstanceType: instanceType, 
        KeyName: 'fuchsia-key-pair',
        MaxCount: 1,
        MinCount: 1,
        SecurityGroupIds: ['sg-0d38bf34dd92e6820'],
        Placement: {
          AvailabilityZone: availabilityZone
        },
        TagSpecifications: [
          {
            ResourceType: "instance",
            Tags: [
              {
                Key: "Name",
                Value: `${projectId}`
              }
            ]
          }
        ]
      }, (error,data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
    console.log(reservation)
    if (reservation.Instances) {
      const instanceIds = reservation.Instances.filter(i => !!i.InstanceId).map(i => i.InstanceId!)
      console.log(`instanceIds`)
      console.log(instanceIds)
      const instancesInfo = await new Promise<AWS.EC2.DescribeInstancesResult>((resolve, reject) => {
        ami.waitFor('instanceRunning', {
          Filters: [{
            Name: 'instance-id',
            Values: instanceIds
          }]
        } as AWS.EC2.Types.DescribeInstancesRequest, (err, newData) => {
          if (err) {
            reject(err)
          } else {
            resolve(newData)
          }
        })
      })
      console.log(`instancesInfo`)
      console.log(instancesInfo)
      if (instancesInfo.Reservations) {
        // update the database with the new ec2 information
        await Promise.all(instancesInfo.Reservations.flatMap(async r => {
          console.log(`r.Instances`)
          console.log(r.Instances)
          if (r.Instances) {
            return r.Instances.map(async i => {
              console.log(`i.PublicDnsName`)
              console.log(i.PublicDnsName)
              if (i.PublicDnsName) {
                await ProjectModel.findByIdAndUpdate(
                  projectId,
                  {
                    "serverConfig.ec2InstanceId": i.InstanceId,
                    "serverConfig.ec2PublicDns": i.PublicDnsName,
                  },
                  { returnDocument: "after" }
                );
                await this.configureInitialSettings(projectId)
              }
            })
          }
        }))
      }
    }

  }

  public async configureInitialSettings(projectId: string) {
    let attempt = 0
    let success = false
    const project = await ProjectModel.findById(new ObjectId(projectId))
    console.log(`projectId`)
    console.log(projectId)
    if (project) {
      while (attempt < RETRY_COUNT && !success) {
        console.log(`while (${attempt} < RETRY_COUNT && !${success})`)
        try {
          const result = await axios.post(`http://${project.serverConfig.ec2PublicDns}:3005/graphql`, {
            operationName: "InitializeSandboxServer",
            query: `
              mutation InitializeSandboxServer {
                initializeSandboxServer(initInput: {
                  projectId: "${projectId}"
                  sessionSecret: "${project.serverConfig.sandboxJwtSecret}"
                  mongoDbConnectionString: "mongodb://localhost:27017"
                  databaseName: "${projectId}-sandbox"
                  redisUrl: "localhost"
                  redisPort: 6379
                  serverPort: 4000
                  fileStorageType: "a"
                  s3AccessKey: "a"
                  s3secret: "a"
                  s3BucketName: "a"
                  appEndpoint: "a"
                  emailConfigType: "Simple"
                  fromEmailAddress: "test@test.com"
                  emailHost: "a"
                  emailPort: "a"
                  emailUser: "a"
                  emailPassword: "a"
                })
              }
            `
          }, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          console.log(`result.data`)
          console.log(result.data)
          success = true
        } catch (e: any) {
          console.log(e?.response?.data)
          attempt++
        }
      }
      attempt = 0

      while (attempt < RETRY_COUNT && !success) {
        console.log(`while (${attempt} < RETRY_COUNT && !${success})`)
        try {
          const result = await axios.post(`http://${project.serverConfig.ec2PublicDns}:3005/graphql`, {
            operationName: "InitializeProductionServer",
            query: `
              mutation InitializeProductionServer {
                initializeProductionServer(initInput: {
                  projectId: "${projectId}"
                  sessionSecret: "${project.serverConfig.liveJwtSecret}"
                  mongoDbConnectionString: "mongodb://localhost:27017"
                  databaseName: "${projectId}-production"
                  redisUrl: "localhost"
                  redisPort: 6379
                  serverPort: 5000
                  fileStorageType: "a"
                  s3AccessKey: "a"
                  s3secret: "a"
                  s3BucketName: "a"
                  appEndpoint: "a"
                  emailConfigType: "Simple"
                  fromEmailAddress: "test@test.com"
                  emailHost: "a"
                  emailPort: "a"
                  emailUser: "a"
                  emailPassword: "a"
                })
              }
            `
          }, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          console.log(`result.data`)
          console.log(result.data)
          success = true
        } catch (e: any) {
          console.log(e?.response?.data)
          attempt++
        }
      }
    }
    return success
  }
}
