import { getModelForClass } from "@typegoose/typegoose";
import { Organization } from "./Organizations/Organization.entity";
import { Project } from "./Projects/Project.entity";
import { User } from "./Users/User.entity";
import { Component } from "./Projects/AppConfig/Components/Component.entity";
import { Package } from "./Packages/Package.entity";
import { Previewer } from "./Previewer/Previewer.entity";
import { Asset } from "./Projects/AppConfig/Libraries/ImageLibrary/ImageFile/AssetFile.entity";
import { Invitation } from "./Invitations/Invitation.entity";

export const OrganizationModel = getModelForClass(Organization);
export const ProjectModel = getModelForClass(Project);
export const UserModel = getModelForClass(User);
export const ComponentModel = getModelForClass(Component);
export const PackageModel = getModelForClass(Package);
export const PreviewerModel = getModelForClass(Previewer);
export const AssetModel = getModelForClass(Asset);
export const InvitationModel = getModelForClass(Invitation);
