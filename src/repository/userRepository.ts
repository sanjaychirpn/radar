import { Service } from 'typedi';
import UserModel, { IUser } from '../models/userModel';
import { Types } from 'mongoose';
import UserRoleModel from '../models/userRoleModel';

@Service()
export class UserRepository {
  async save(user: IUser): Promise<IUser | null> {
    const newUser = await new UserModel(user).save();
    const populatedUser = await UserModel.findById(newUser._id)
      .populate('role')
      .populate('employeeType')
      .exec();

    if (populatedUser) {
      populatedUser.password = undefined;
    }

    return populatedUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email }).exec();
    if (user) {
      user.password = undefined;
    }
    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id)
      .populate('role')
      .populate('examCenters')
      .populate('employeeType')
      .exec();

    if (user) {
      user.password = undefined;
    }

    return user;
  }

  async updateById(_id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, userData, { new: true })
      .populate('role')
      .populate('examCenters')
      .populate('employeeType')
      .exec();

    if (updatedUser) {
      updatedUser.password = undefined;
    }

    return updatedUser;
  }

  async deleteById(_id: string): Promise<IUser | null> {
    const deletedUser = await UserModel.findByIdAndDelete(_id).exec();
    if (deletedUser) {
      deletedUser.password = undefined;
    }
    return deletedUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await UserModel.find()
      .populate('role')
      .populate('examCenters')
      .populate('employeeType')
      .lean()
      .exec();

    return users.map(user => {
      delete user.password;
      return user;
    });
  }

  async findUsersByExamCenterAndRole(id: string, role: string): Promise<IUser[]> {
    const roleDoc = await UserRoleModel.findOne({ name: role }).exec();
    if (!roleDoc) {
      throw new Error(`Role ${role} not found`);
    }
    const roleId = roleDoc._id;
    const users = await UserModel.find({ examCenters: id, role: roleId })
      .lean()
      .exec();

    return users.map(user => {
      delete user.password;
      return user;
    });
  }
}
