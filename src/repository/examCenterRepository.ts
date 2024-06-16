import { Service } from 'typedi';
import { Types } from 'mongoose';
import ExamCenterModel, { IExamCenter } from '../models/examCenterModel';

@Service()
export class ExamCenterRepository {

  async save(examCenter: IExamCenter): Promise<IExamCenter | null> {
    const examCenterData = new ExamCenterModel(examCenter);
    return new ExamCenterModel(examCenterData).save();
  }

  async updateById(_id: string, examCenterData: Partial<IExamCenter>): Promise<IExamCenter | null> {
    return ExamCenterModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, examCenterData, {
      new: true,
    }).exec();
  }

  async findById(_id: string): Promise<IExamCenter | null> {
    return ExamCenterModel.findById(new Types.ObjectId(_id)).exec();
  }

  async deleteById(_id: string): Promise<IExamCenter | null> {
    try {
      const deletedExamCenter = await ExamCenterModel.findByIdAndDelete(new Types.ObjectId(_id)).exec();
      if (!deletedExamCenter) {
        return null;
      }
      return deletedExamCenter as IExamCenter;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
