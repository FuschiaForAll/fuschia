import {
  Authorized,
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
} from "type-graphql";
import { Invitation } from "./Invitation.entity";
import { Context } from "../types";
import { userInfo } from "os";
import { InvitationModel, OrganizationModel, UserModel } from "../Models";
import { ObjectIdScalar } from "../utils/object-id.scalar";
import { ObjectId } from "mongoose";
import crypto from "crypto";
import { mailClient } from "../utils/email";
import { APP_ENDPOINT, FROM_EMAIL_ADDRESS } from "../utils/config";

@Resolver((of) => Invitation)
export class InvitationResolver {
  @Query((returns) => Invitation)
  async invitation(
    @Arg("invitationId", (type) => ObjectIdScalar) invitationId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (!ctx.user) {
      throw new UnauthorizedError();
    }
    const invitee = await InvitationModel.findById(invitationId);
    console.warn(
      `SECURITY ISSUE: Ensure that the user has the right to query the invitation`
    );
    if (invitee) {
      return invitee;
    } else if (!invitee) {
      throw new Error(`Cannot find invitee with id: ${invitationId}`);
    }
    throw new UnauthorizedError();
  }

  @Authorized()
  @Mutation((returns) => Invitation)
  async inviteMember(
    @Arg("organizationId", (type) => ObjectIdScalar) organizationId: ObjectId,
    @Arg("email") email: string,
    @Arg("sendInvite", { nullable: true }) sendInvite: boolean,
    @Ctx() ctx: Context
  ) {
    if (!ctx.user) {
      throw new UnauthorizedError();
    }
    console.warn(
      `SECURITY ISSUE: Ensure that the user has the right to invite people`
    );
    const organization = OrganizationModel.findById(organizationId);
    if (organization) {
      const token = crypto.randomBytes(20).toString("hex");
      const expires = Date.now() + 86400000;
      if (sendInvite) {
        mailClient.sendMail({
          from: FROM_EMAIL_ADDRESS,
          to: email,
          subject: `Initation: ${organization.name} has invited you to SquareTwo`,
          html: `
            <p>You have been invited to join eClarity.</p>
            <p><a href="${APP_ENDPOINT}/sign-up">Accept the invitaion by signing up</a></p>
          `,
        });
      }
      const invitation = await InvitationModel.findOne({
        userEmail: email,
        organizationId,
      });
      if (invitation) {
        invitation.token = token;
        invitation.expires = expires;
        return invitation.save();
      } else {
        return await InvitationModel.create({
          userEmail: email,
          organizationId,
          token,
          expires,
        });
      }
    }
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async acceptInvitaion(
    @Arg("invitationId", (type) => ObjectIdScalar) invitationId: ObjectId,
    @Ctx() ctx: Context
  ) {
    if (!ctx.user) {
      throw new Error();
    }
    const invitation = await InvitationModel.findOne({
      userEmail: ctx.user.email,
      _id: invitationId,
    });
    if (invitation) {
      const organization = await OrganizationModel.findById(
        invitation.organizationId
      );
      const user = await UserModel.findOne({ email: invitation.userEmail });
      if (organization && user) {
        organization.members.push(user);
        organization.save();
        return true;
      }
    }
    return false;
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async deleteInvitation(
    @Arg("organizationId", (type) => ObjectIdScalar) organizationId: ObjectId,
    @Arg("email") email: string,
    @Ctx() ctx: Context
  ) {
    throw new Error("Not Implemented");
  }
}
