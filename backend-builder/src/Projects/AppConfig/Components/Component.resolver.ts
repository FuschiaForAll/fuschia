import { mongoose } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { ComponentModel, ProjectModel } from "../../../Models";
import { Context } from "../../../types";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { ProjectService } from "../../Project.service";
import { Component } from "./Component.entity";
import { ComponentInput } from "./Component.input";
import * as _ from "lodash";

@Service()
@Resolver(Component)
export class ComponentResolver {
  constructor(private projectService: ProjectService) {}

  @Query((returns) => Component, { nullable: true })
  async getComponent(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Ctx() ctx: Context
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to get ComponentId`
    );
    return ComponentModel.findById(componentId);
  }

  @Query((returns) => [Component])
  async getComponents(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const project = await ProjectModel.findById(projectId).populate(
      "components"
    );
    if (project) {
      return project.components;
    }
    throw new ApolloError("Project does not exist");
  }

  @Mutation((returns) => Component)
  async createComponent(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("componentInput", (type) => ComponentInput)
    componentInput: ComponentInput,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }
    const newcomponent = await ComponentModel.create({
      ...componentInput,
    });
    if (!componentInput.parent) {
      const project = await ProjectModel.findByIdAndUpdate(
        projectId,
        {
          $push: {
            components: {
              _id: newcomponent._id,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
      console.log(project);
    }

    return {
      _id: newcomponent._id,
      ...componentInput,
    };
  }

  @Mutation((returns) => Component)
  async updateComponent(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("componentInput", (type) => ComponentInput)
    componentInput: ComponentInput,
    @Ctx() ctx: Context
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to modify ComponentId`
    );
    // merge the props from old and new...
    const component = await ComponentModel.findById(componentId);
    if (component) {
      const oldProps = JSON.parse(component.props || "{}");
      console.log(`oldProps`);
      console.log(oldProps);
      const newProps = JSON.parse(componentInput.props || "{}");
      console.log(`newProps`);
      console.log(newProps);
      const updates = { ...componentInput };
      const mergeProps = _.merge(oldProps, newProps);
      updates.props = JSON.stringify(mergeProps);
      console.log(`updates`);
      console.log(updates);
      return ComponentModel.findByIdAndUpdate(
        componentId,
        {
          ...updates,
        },
        { returnDocument: "after" }
      );
    }
    throw new ApolloError("Component not found");
  }

  @Mutation((returns) => [ObjectIdScalar])
  async deleteComponents(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("componentIds", (type) => [ObjectIdScalar]) componentIds: ObjectId[],
    @Ctx() ctx: Context
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to delete ComponentId`
    );
    await ComponentModel.deleteMany({
      _id: componentIds,
    });
    console.log(componentIds);
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $pullAll: {
          components: componentIds,
        },
      },
      { new: true }
    );
    console.log(project?.components);
    return componentIds;
  }
  
  @FieldResolver()
  async children(@Root() component: Component) {
    return ComponentModel.find({
      parent: component._id,
    });
  }
}
