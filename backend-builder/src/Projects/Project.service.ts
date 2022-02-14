import { ObjectId } from "mongoose"
import { Service } from "typedi"
import { OrganizationModel } from "../Models"

@Service()
export class ProjectService {
  public async checkAccess(projectId: ObjectId, userId: ObjectId) {
    const org = await OrganizationModel.findOne({
      $and: [
        { projects: projectId },
        { $or: [{members: userId}, {owner: userId}] }
      ]
    })
    return !!org
  }
}