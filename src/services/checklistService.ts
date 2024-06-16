import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';
import { ChecklistRepository } from '../repository/checklistRepository';
import { IChecklist } from '../models/ChecklistModel';
import { Types } from 'mongoose';

@Service()
export class ChecklistService {
  constructor(@Inject() private checklistRepository: ChecklistRepository) { }

  save = async (req: Request, res: Response) => {
    try {
      const checklist: IChecklist = req.body;
      const newChecklist = await this.checklistRepository.save(checklist);
      if (!newChecklist) {
        return responseStatus(res, 500, msg.checklist.errorInSaving, null);
      }
      return responseStatus(res, 200, msg.checklist.checklistSavedSuccess, newChecklist);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const checklistData: Partial<IChecklist> = req.body;
      const updatedChecklist = await this.checklistRepository.updateById(id, checklistData);
      if (!updatedChecklist) {
        return responseStatus(res, 404, msg.checklist.checklistNotFound, null);
      }
      return responseStatus(res, 200, msg.checklist.checklistUpdatedSuccess, updatedChecklist);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedChecklist = await this.checklistRepository.deleteById(id);
      if (!deletedChecklist) {
        return responseStatus(res, 404, msg.checklist.checklistNotFound, null);
      }
      return responseStatus(res, 200, msg.checklist.checklistDeletedSuccess, {});
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  async createChecklistsForUser(examCenterId: string, userId: string): Promise<void> {
    const examCenterObjectId = new Types.ObjectId(examCenterId);
    const userObjectId = new Types.ObjectId(userId);

    const oneDayBeforeItems = [
      { name: 'Drinking Water', isAvailable: false, images: [] },
      { name: 'Inverter Backup', isAvailable: false, images: [] },
      { name: 'Computer Lab', isAvailable: false, images: [] },
      { name: 'Facilities', isAvailable: false, images: [] },
      { name: 'AC Cooling and Fans', isAvailable: false, images: [] },
      { name: 'Cleanliness', isAvailable: false, images: [] },
      { name: 'Sitting Arrangement', isAvailable: false, images: [] }
    ];

    const twoHoursBeforeItems = [
      { name: "PC's Turned on", isAvailable: false, images: [] },
      { name: 'Login Page Opened', isAvailable: false, images: [] },
      { name: 'A4 Sheets Placed', isAvailable: false, images: [] }
    ];

    await this.checklistRepository.create({
      type: 'OneDayBefore',
      items: oneDayBeforeItems,
      examCenter: examCenterObjectId,
      user: userObjectId
    } as unknown as IChecklist);
    
    await this.checklistRepository.create({
      type: 'TwoHoursBefore',
      items: twoHoursBeforeItems,
      examCenter: examCenterObjectId,
      user: userObjectId
    } as unknown as IChecklist);
  }

  async assignUsersToChecklists(examCenterId: string, userIds: string[]): Promise<void> {
    for (const userId of userIds) {
      await this.createChecklistsForUser(examCenterId, userId);
    }
  }

  async updateChecklistItem(id: string, checklistData: Partial<IChecklist>): Promise<IChecklist | null> {
    return this.checklistRepository.updateById(id, checklistData);
  }
  
  async addMediaToChecklistItem(checklistId: string, itemName: string, mediaUrl: string): Promise<IChecklist | null> {
    const checklist = await this.checklistRepository.findById(checklistId);
    if (!checklist) {
      throw new Error('Checklist not found');
    }
    const item = checklist.items.find(i => i.name === itemName);
    if (!item) {
      throw new Error('Item not found in checklist');
    }
    item.image.push(mediaUrl);
    return this.checklistRepository.updateById(checklistId, checklist);
  }
  async getChecklistById(id: string): Promise<IChecklist | null> {
    return this.checklistRepository.findById(id);
  }

  async getChecklistsByExamCenterAndUser(examCenterId: string, userId: string): Promise<IChecklist[]> {
    return this.checklistRepository.findByExamCenterAndUser(examCenterId, userId);
  }
}
