import { Service } from 'typedi';
import UserRoleModel, { IUserRole } from '../models/userRoleModel';

@Service()
export class UserRoleRepository {
  async save(userRole: IUserRole): Promise<IUserRole | null> {
    return new UserRoleModel(userRole).save();
  }

  async updateById(_id: string, userRoleData: IUserRole): Promise<IUserRole | null> {
    return UserRoleModel.findOneAndUpdate({ _id }, userRoleData, { new: true }).exec();
  }

  async deleteById(_id: string): Promise<IUserRole | null> {
    return UserRoleModel.findByIdAndDelete(_id).exec();
  }

  async findAll(): Promise<IUserRole[]> {
    return UserRoleModel.find()

  }
  async findByid(_id: string): Promise<IUserRole | null> {
    return UserRoleModel.findById(_id).exec();
  }

}
