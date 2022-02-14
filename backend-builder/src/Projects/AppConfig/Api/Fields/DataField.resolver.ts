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
      const entityModel = project.appConfig.apiConfig.models.find(model => model._id.instance === entityModelId.instance)
      console.log(entityModel)
      if (entityModel) {
        const newDataField = new DataField()
        newDataField.fieldName = dataField.fieldName
        newDataField.isUnique = dataField.isUnique
        newDataField.isHashed = dataField.isHashed
        newDataField.dataType = dataField.dataType
        newDataField.nullable = dataField.nullable
        entityModel.fields.push(newDataField)
        console.log(entityModel)
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
  @Mutation(() => Boolean, { nullable: true })
  async deleteEntityModel(@Ctx() ctx: Context) {
    return true
  }
}