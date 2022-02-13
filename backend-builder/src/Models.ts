import { getModelForClass } from "@typegoose/typegoose";
import { Organization } from "./Organizations/Organization.entity";
import { Project } from "./Projects/Project.entity";
import { User } from "./Users/User.entity";

export const OrganizationModel = getModelForClass(Organization)
export const ProjectModel = getModelForClass(Project)
export const UserModel = getModelForClass(User)