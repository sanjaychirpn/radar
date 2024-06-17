import { Service } from 'typedi';
import { Types } from 'mongoose';
import ChecklistModel, { IChecklist } from '../models/ChecklistModel';

@Service()
export class ChecklistRepository {
  async save(checklist: IChecklist): Promise<IChecklist | null> {
    return new ChecklistModel(checklist).save();
  }

  async updateById(_id: string, checklistData: Partial<IChecklist>): Promise<IChecklist | null> {
    return ChecklistModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, checklistData, { new: true }).exec();
  }

  async deleteById(_id: string): Promise<IChecklist | null> {
    return ChecklistModel.findByIdAndDelete(new Types.ObjectId(_id)).exec();
  }

  async create(checklist: IChecklist): Promise<IChecklist> {
    return new ChecklistModel(checklist).save();
  }

  async findByExamCenter(examCenterId: Types.ObjectId): Promise<IChecklist[]> {
    return ChecklistModel.find({ examCenter: examCenterId }).exec();
  }

  async findByExamCenterAndUser(examCenterId: string, userId: string): Promise<IChecklist[]> {
    return ChecklistModel.find({ examCenter: new Types.ObjectId(examCenterId), user: new Types.ObjectId(userId) }).exec();
  }

  async assignUserToChecklists(examCenterId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const checklists = await this.findByExamCenter(examCenterId);
    for (const checklist of checklists) {
      checklist.user = userId;
      await checklist.save();
    }
  }

  async findById(_id: string): Promise<IChecklist | null> {
    return ChecklistModel.findById(_id).exec();
  }

  async findAll(): Promise<IChecklist[]> {
    return ChecklistModel.find()

  }
}
