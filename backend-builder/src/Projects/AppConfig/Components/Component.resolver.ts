import { mongoose } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { ComponentModel, PackageModel, ProjectModel } from "../../../Models";
import { Context } from "../../../types";
import { ObjectIdScalar } from "../../../utils/object-id.scalar";
import { ProjectService } from "../../Project.service";
import { Component, RequiredParameter } from "./Component.entity";
import { ComponentInput, RequiredParameterInput } from "./Component.input";
import * as _ from "lodash";

@ObjectType()
class DataContext {
  @Field()
  componentId!: string;
  @Field()
  name!: string;
  @Field((type) => [String])
  dataSources!: string[];
}

@ObjectType()
class DataComponent {
  @Field()
  componentId!: string;
  @Field()
  name!: string;
  @Field()
  dataType!: string;
}

@ObjectType()
class DataStructure {
  @Field()
  _id!: string;
  @Field()
  name!: string;
  @Field((type) => [MenuStructure])
  fields!: MenuStructure[];
}

@ObjectType()
class MenuStructure {
  @Field()
  type!: string;
  @Field()
  source!: string;
  @Field()
  entity!: string;
  @Field()
  label!: string;
  @Field()
  hasSubMenu!: boolean;
}

@ObjectType()
class BindingContext {
  @Field((type) => [DataStructure])
  structure!: DataStructure[];
  @Field((type) => [MenuStructure])
  menu!: MenuStructure[];
}

async function getParentRecursive(
  componentId: string,
  acc: DataContext[]
): Promise<DataContext[]> {
  const component = await ComponentModel.findById(componentId);
  let ret = [...acc];
  console.log(`component`);
  console.log(component);
  if (!component) {
    throw new Error(`Component with id ${componentId} does not exist`);
  }
  if (component.parent) {
    ret = [
      ...ret,
      ...(await getParentRecursive(component.parent._id.toString(), [...acc])),
    ];
  }
  if (component.isRootElement) {
    return [
      ...ret,
      {
        componentId: component._id.toString(),
        name: component.name,
        dataSources:
          component.parameters?.map((p) => p.entityType.toString()) || [],
      },
    ];
  }
  if (component.isContainer) {
    console.log(`component.isContainer`);
    return [
      ...ret,
      {
        componentId: component._id.toString(),
        name: component.name,
        dataSources: component.fetched?.map((f) => f.entityType) || [],
      },
    ];
  }
  console.log(ret);
  return ret;
}

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

  @Query((returns) => [DataContext])
  async getDataContext(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Ctx() ctx: Context
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to get ComponentId`
    );
    return getParentRecursive(componentId.toString(), []);
  }

  @Query((returns) => BindingContext)
  async getBindingTree(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ): Promise<BindingContext> {
    console.error(
      `SECURITY WARNING: Validate that the user has access to get ComponentId`
    );
    let menuStructure = [] as MenuStructure[];
    let dataStructure = [] as DataStructure[];
    const project = await ProjectModel.findById(projectId).populate(
      "components"
    );
    const packages = await PackageModel.find();
    console.log(project);
    if (project) {
      const authTable = project.appConfig.apiConfig.models.find(
        (m) => m._id.toString() === project.appConfig.authConfig.tableId
      );
      if (authTable) {
        menuStructure.push({
          type: "SERVER_DATA",
          label: "Current User",
          hasSubMenu: true,
          entity: project.appConfig.authConfig.tableId,
          source: "CurrentUser",
        });
      }

      menuStructure.push({
        type: "INPUTS",
        label: "Inputs",
        hasSubMenu: true,
        entity: "InputObject",
        source: "InputObject",
      });
      const inputObjects = {
        _id: "InputObject",
        name: "Inputs",
        fields: (project.components as Component[]).map((c) => ({
          type: "INPUTS",
          entity: c._id.toString(),
          hasSubMenu: !!(c.children && c.children.length > 0),
          source: c._id.toString(),
          label: c.name,
        })),
      };
      dataStructure.push(inputObjects);

      const search = async (c: Component) => {
        const newStructure = {
          _id: c._id.toString(),
          name: c.name,
          fields: [],
        } as DataStructure;
        const children = await ComponentModel.find({
          parent: c._id,
        });
        console.log(children);
        children.forEach((ch) => {
          if (ch.children && ch.children.length > 0) {
            newStructure.fields.push({
              type: "INPUTS",
              source: ch._id.toString(),
              entity: ch._id.toString(),
              label: ch.name,
              hasSubMenu: !!(ch.children && ch.children.length > 0),
            });
          }

          packages
            .flatMap((p) =>
              p.components.map((c) => ({
                packageName: p.packageName,
                componentName: c.name,
                data: c.schema.data,
              }))
            )
            .filter(
              (dc) =>
                dc.packageName === ch.package &&
                dc.componentName === ch.type &&
                dc.data
            )
            .forEach((dc) => {
              Object.keys(dc.data).forEach((dataKey) =>
                newStructure.fields.push({
                  type: "INPUTS",
                  source: ch._id.toString(),
                  hasSubMenu: false,
                  entity: dc.data[dataKey],
                  label: `${ch.name}'s ${dataKey}`,
                })
              );
            });
        });

        dataStructure.push(newStructure);
        console.log(dataStructure);
        children.forEach((ch) => search(ch));
      };
      await Promise.all(
        (project.components as Component[]).map(async (c) => await search(c))
      );

      project.appConfig.apiConfig.models.forEach((model) =>
        dataStructure.push({
          _id: model._id.toString(),
          name: model.name,
          fields: [
            {
              type: "REMOTE_DATA",
              entity: "string",
              hasSubMenu: false,
              source: "_id",
              label: "ID",
            },
            ...model.fields
              .filter((field) => !field.isList) // don't add lists for now
              .map((field) => ({
                type: "REMOTE_DATA",
                entity: field.dataType,
                hasSubMenu: !!field.connection,
                source: field._id.toString(),
                label: field.fieldName,
              })),
          ],
        })
      );

      const extractModelName = (name: string): [string, boolean] => {
        const entity = dataStructure.find((d) => d._id === name);
        if (entity) {
          return [entity.name, true];
        }
        const input = inputObjects.fields.find((i) => i.source === name);
        if (input) {
          return [input.label, true];
        }
        return [name, false];
      };

      const dataContext = await getParentRecursive(componentId.toString(), []);
      dataContext.forEach((item) => {
        item.dataSources.forEach((source) => {
          const [name, hasSubMenu] = extractModelName(source);
          menuStructure.push({
            type: "REMOTE_DATA",
            source: item.componentId,
            entity: source,
            label: `${item.name}'s ${name}`,
            hasSubMenu,
          });
        });
      });
    }
    // Current User
    // Inputs
    // Entities
    console.log(`RETURNING`);
    console.log(dataStructure);
    return {
      menu: menuStructure,
      structure: dataStructure,
    } as BindingContext;
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
      parameters: componentInput.isRootElement ? [] : undefined,
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
      const oldProps = component.props;
      console.log(`oldProps`);
      console.log(oldProps);
      const newProps = componentInput.props;
      console.log(`newProps`);
      console.log(newProps);
      const updates = { ...componentInput };
      const mergeProps = _.merge(oldProps, newProps);
      updates.props = mergeProps;
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

  @Mutation((returns) => Boolean)
  async addParameter(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("parameterInput", (type) => RequiredParameterInput)
    parameterInput: RequiredParameterInput
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to add parameters`
    );
    const component = await ComponentModel.findById(componentId);
    if (component) {
      if (!component.parameters) {
        component.parameters = [parameterInput];
      } else {
        component.parameters.push(parameterInput);
      }
      await component.save();
      return true;
    }
  }

  @Mutation((returns) => Boolean)
  async updateParameter(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("parameterId", (type) => ObjectIdScalar) parameterId: ObjectId,
    @Arg("parameterInput", (type) => RequiredParameterInput)
    parameterInput: RequiredParameterInput
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to add parameters`
    );
    const component = await ComponentModel.findById(componentId);
    if (component) {
      if (component.parameters) {
        const param = component.parameters.findIndex(
          (p) => p._id!.toString() === parameterId.toString()
        );
        if (param !== -1) {
          component.parameters[param] = {
            ...component.parameters[param],
            ...parameterInput,
          };
        }
      }
      await component.save();
      return true;
    }
  }

  @Mutation((returns) => Boolean)
  async removeParameter(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("parameterId", (type) => ObjectIdScalar)
    parameterId: ObjectId
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to remove parameters`
    );
    const component = await ComponentModel.findById(componentId);
    if (component) {
      if (component.parameters) {
        component.parameters = component.parameters.filter(
          (p) => p._id!.toString() !== parameterId.toString()
        );
      }
      await component.save();
      return true;
    }
  }

  @Mutation((returns) => Boolean)
  async duplicateComponent(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to duplicate parameters`
    );
    const component = await ComponentModel.findById(componentId);
    if (component) {
      // duplicate all nested components as well
      const duplicateNested = async (
        originalId: ObjectId,
        nestedComponent: Component
      ) => {
        const children = await ComponentModel.find({
          parent: originalId,
        });
        children.forEach(async (child) => {
          const childClone = { ...child.toJSON() } as any;
          childClone.parent = nestedComponent;
          delete childClone._id;
          const newChildComponent = await ComponentModel.create({
            ...childClone,
          });
          duplicateNested(child._id, newChildComponent);
        });
      };

      console.log(`component`);
      console.log(component);
      const clone = { ...component.toJSON() } as any;
      console.log(`clone`);
      console.log(clone);
      delete clone._id;
      clone.x = (component.x || 0) + 10;
      clone.y = (component.y || 0) + 10;
      const newComponent = await ComponentModel.create({
        ...clone,
      });
      if (!component.parent) {
        const project = await ProjectModel.findByIdAndUpdate(
          projectId,
          {
            $push: {
              components: {
                _id: newComponent._id,
              },
            },
          },
          { new: true, useFindAndModify: false }
        );
        console.log(project);
      }
      duplicateNested(component._id, newComponent);
    }
    return true;
  }

  @Mutation((returns) => Component)
  async updateComponentProps(
    @Arg("componentId", (type) => ObjectIdScalar) componentId: ObjectId,
    @Arg("props", (type) => Object) props: Object
  ) {
    console.error(
      `SECURITY WARNING: Validate that the user has access to add parameters`
    );
    console.log(componentId);
    console.log(JSON.stringify(props));
    return ComponentModel.findByIdAndUpdate(
      componentId,
      { props },
      { returnDocument: "after" }
    );
  }

  @FieldResolver()
  async children(@Root() component: Component) {
    return ComponentModel.find({
      parent: component._id,
    });
  }
}
