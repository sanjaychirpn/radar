import { Service } from 'typedi';
import EmployeeTypeModel, { IEmployeeType } from '../models/employeeTypeModel';

@Service()
export class EmployeeTypeRepository {
  async save(employeeType: IEmployeeType): Promise<IEmployeeType | null> {
    return new EmployeeTypeModel(employeeType).save();
  }

  async updateById(_id: string, employeeTypeData: IEmployeeType): Promise<IEmployeeType | null> {
    return EmployeeTypeModel.findOneAndUpdate({ _id }, employeeTypeData, { new: true }).exec();
  }

  async deleteById(_id: string): Promise<IEmployeeType | null> {
    return EmployeeTypeModel.findByIdAndDelete(_id).exec();
  }
}
