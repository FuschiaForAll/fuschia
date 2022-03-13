import { ApolloError } from "apollo-server";
import { ObjectId } from "mongoose";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ProjectModel } from "../../../../Models";
import { Context } from "../../../../types";
import { ObjectIdScalar } from "../../../../utils/object-id.scalar";
import { Project } from "../../../Project.entity";
import { ProjectService } from "../../../Project.service";
import {
  LabelLibrary,
  LabelTag,
  Language,
  LanguageTranslation,
  Translation,
} from "./LabelLibrary.entity";

@Service()
@Resolver()
export class LabelLibraryResolver {
  constructor(private projectService: ProjectService) {}
  @Mutation((type) => Project)
  async createLanguage(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("languageName") languageName: string,
    @Arg("languageCode") languageCode: string,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const project = await ProjectModel.findById(projectId);
    if (project) {
      if (!project.labelLibrary) {
        const labelLibrary = new LabelLibrary();
        project.labelLibrary = labelLibrary;
      }
      const newLanguage = new Language();
      newLanguage.name = languageName;
      newLanguage.code = languageCode;
      project.labelLibrary.languages?.push(newLanguage);
      return project.save();
    }
  }

  @Mutation((type) => Project)
  async createLabelTag(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("tagName") tagName: string,
    @Arg("numberOfStates", (type) => Int) numberOfStates: number,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const project = await ProjectModel.findById(projectId);
    if (project) {
      if (!project.labelLibrary) {
        const labelLibrary = new LabelLibrary();
        project.labelLibrary = labelLibrary;
      }
      const newLabel = new LabelTag();
      newLabel.name = tagName;
      newLabel.numberOfStates = numberOfStates;
      project.labelLibrary.labelTags?.push(newLabel);
      return project.save();
    }
  }

  @Mutation((type) => Project)
  async createTranslation(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("languageId", (type) => ObjectIdScalar) languageId: ObjectId,
    @Arg("tagId", (type) => ObjectIdScalar) tagId: ObjectId,
    @Arg("translations", (type) => [String]) translations: string[],
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const project = await ProjectModel.findById(projectId);
    if (project && project.labelLibrary) {
      const language = project.labelLibrary.translations.find(
        (translation) => translation.language === languageId
      );
      if (language) {
        const newTranslation = new Translation();
        newTranslation.tag = tagId;
        newTranslation.value = translations;
        language.translations.push(newTranslation);
      } else {
        const newLanguageTranslation = new LanguageTranslation();
        newLanguageTranslation.language = languageId;
        newLanguageTranslation.translations = [];
        const newTranslation = new Translation();
        newTranslation.tag = tagId;
        newTranslation.value = translations;
        newLanguageTranslation.translations.push(newTranslation);
        project.labelLibrary.translations.push(newLanguageTranslation);
      }
      project.save();
    }
  }

  @Mutation((type) => Project)
  async updateTranslation(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Arg("languageId", (type) => ObjectIdScalar) languageId: ObjectId,
    @Arg("tagId", (type) => ObjectIdScalar) tagId: ObjectId,
    @Arg("translations", (type) => [String]) translations: string[],
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const project = await ProjectModel.findById(projectId);
    if (project && project.labelLibrary) {
      const languageTranslations = project.labelLibrary.translations.find(
        (t) => t.language.toString() === languageId.toString()
      );
      console.log(languageTranslations);
      const translation = languageTranslations?.translations.find(
        (t) => t.tag.toString() === tagId.toString()
      );
      console.log(translation);
      if (translation) {
        translation.value = translations;
        project.save();
      }
    }
  }

  @Query((type) => LabelLibrary, { nullable: true })
  async getLabelLibrary(
    @Arg("projectId", (type) => ObjectIdScalar) projectId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (
      !ctx.req.session.userId ||
      !this.projectService.checkAccess(projectId, ctx.req.session.userId)
    ) {
      throw new ApolloError("Unauthorized");
    }

    const project = await ProjectModel.findById(projectId);
    if (project) {
      return project.labelLibrary;
    }
  }
}
