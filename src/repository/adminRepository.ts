import { Service } from 'typedi';
import AdminModel, { IAdmin } from '../models/adminModel';

@Service()
export class AdminRepository {
  async save(admin: IAdmin): Promise<IAdmin | null> {
    return new AdminModel(admin).save();
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return AdminModel.findOne({ email }).exec();
  }

  async updateById(_id: string, adminData: IAdmin): Promise<IAdmin | null> {
    return AdminModel.findOneAndUpdate({ _id }, adminData, { new: true }).exec();
  }

  async deleteById(_id: string): Promise<IAdmin | null> {
    return AdminModel.findByIdAndDelete(_id).exec();
  }

  
  async findAll(): Promise<IAdmin[]> {
    return AdminModel.find()

  }
  async findByid(_id: string): Promise<IAdmin | null> {
    return AdminModel.findById(_id).exec();
  }
}
