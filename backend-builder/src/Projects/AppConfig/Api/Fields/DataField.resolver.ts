import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ProjectModel } from "../../../../Models";
import { Context } from "../../../../types";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { ProjectService } from "../../../Project.service";
import { DataField } from "./DataField.entity";
import { DataFieldInput } from "./DataField.input";

@Service()
@Resolver()
export class DataFieldResolver {
  constructor(
    private projectService: ProjectService
  ) { }

  @Mutation(() => DataField, { nullable: true })
  async createDataField(@Arg('projectId', type => ObjectIdScalar) projectId: ObjectId, @Arg('entityModelId', type => ObjectIdScalar) entityModelId: ObjectId, @Arg('dataField') dataField: DataFieldInput, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId || !this.projectService.checkAccess(projectId, ctx.req.session.userId)) { throw new ApolloError('Unauthorized')}
    const project = await ProjectModel.findById(projectId)
    if (project) {
      const entityModel = project.appConfig.apiConfig.models.find(model => {
        // @ts-ignore
        return model._id.equals(entityModelId)
      })
      if (entityModel) {
        const newDataField = new DataField()
        newDataField.fieldName = dataField.fieldName
        newDataField.isUnique = dataField.isUnique
        newDataField.isHashed = dataField.isHashed
        newDataField.dataType = dataField.dataType
        newDataField.nullable = dataField.nullable
        entityModel.fields.push(newDataField)
        project.save()
        return entityModel.fields.at(-1)
      }
    }
    return null
  }

  @Query(() => Boolean, { nullable: true })
  async retrieveEntityModel(@Ctx() ctx: Context) {
    return true
  }
  @Query(() => Boolean, { nullable: true })
  async listEntityModel(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => Boolean, { nullable: true })
  async updateEntityModel(@Ctx() ctx: Context) {
    return true
  }
  @Mutation(() => ObjectIdScalar, { nullable: true })
  async deleteDataField(@Arg('projectId', type => ObjectIdScalar) projectId: ObjectId, @Arg('entityModelId', type => ObjectIdScalar) entityModelId: ObjectId, @Arg('dataFieldId', type => ObjectIdScalar) dataFieldId: ObjectId, @Ctx() ctx: Context) {
    if (!ctx.req.session.userId || !this.projectService.checkAccess(projectId, ctx.req.session.userId)) { throw new ApolloError('Unauthorized')}
    const project = await ProjectModel.findById(projectId)
    if (project) {
      const entityModel = project.appConfig.apiConfig.models.find(model => {
        // @ts-ignore
        return model._id.equals(entityModelId)
      })
      if (entityModel) {
        entityModel.fields = entityModel.fields.filter(field => {
          // @ts-ignore
        return !field._id.equals(dataFieldId)
        })
        project.save()
        return dataFieldId
      }
    }
    return null
  }
}