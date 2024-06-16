import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ChecklistService } from '../services/checklistService';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

@Service()
export class ChecklistController {
  constructor(@Inject() private checklistService: ChecklistService) {}

  createChecklist = async (req: Request, res: Response) => {
    try {
      return await this.checklistService.save(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateChecklist = async (req: Request, res: Response) => {
    try {
      return await this.checklistService.update(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  deleteChecklist = async (req: Request, res: Response) => {
    try {
      return await this.checklistService.delete(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateChecklistItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const checklistData = req.body;
      const updatedChecklist = await this.checklistService.updateChecklistItem(id, checklistData);
      if (!updatedChecklist) {
        return responseStatus(res, 404, msg.checklist.checklistNotFound, null);
      }
      return responseStatus(res, 200, msg.checklist.checklistUpdatedSuccess, updatedChecklist);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  addMediaToChecklistItem = async (req: Request, res: Response) => {
    try {
      const { checklistId, itemName } = req.params;
      const { mediaUrl } = req.body;
      const updatedChecklist = await this.checklistService.addMediaToChecklistItem(checklistId, itemName, mediaUrl);
      if (!updatedChecklist) {
        return responseStatus(res, 404, msg.checklist.checklistNotFound, null);
      }
      return responseStatus(res, 200, msg.checklist.mediaAddedSuccess, updatedChecklist);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  getChecklistById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const checklist = await this.checklistService.getChecklistById(id);
      if (!checklist) {
        return responseStatus(res, 404, msg.checklist.checklistNotFound, null);
      }
      return responseStatus(res, 200, msg.checklist.checklistFoundSuccess, checklist);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  getChecklistsByExamCenterAndUser = async (req: Request, res: Response) => {
    try {
      const { examCenterId, userId } = req.params;
      const checklists = await this.checklistService.getChecklistsByExamCenterAndUser(examCenterId, userId);
      return responseStatus(res, 200, msg.checklist.checklistsFoundSuccess, checklists);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };


}
