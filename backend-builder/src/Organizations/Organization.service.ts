import { ObjectId } from "mongoose"
import { Service } from "typedi"
import { OrganizationModel } from "../Models"

@Service()
export class OrganizationService {
  public getOrganization(organizationId: ObjectId, userId: ObjectId) {
    return OrganizationModel.findOne({
      $and: [
        { _id: organizationId },
        { $or: [{members: userId}, {owner: userId}] }
      ]
    })
  }
}