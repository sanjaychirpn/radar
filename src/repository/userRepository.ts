import { Service } from 'typedi';
import UserModel, { IUser } from '../models/userModel';
import { Types } from 'mongoose';

@Service()
export class UserRepository {
  async save(user: IUser): Promise<IUser | null> {
    const newUser = await new UserModel(user).save();
    return UserModel.findById(newUser._id)
      .populate('role')
      .populate('examCenter')
      .populate('employeeType')
      .exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id)
      .populate('role')
      .populate('examCenter')
      .populate('employeeType')
      .exec();
  }

  async updateById(_id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, userData, { new: true }).exec();
  }

  async deleteById(_id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(_id).exec();
  }
}
