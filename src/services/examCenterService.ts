import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';
import { ExamCenterRepository } from '../repository/examCenterRepository';
import { ChecklistService } from './checklistService';
import { IExamCenter } from '../models/examCenterModel';
import { UserService } from './userService';

@Service()
export class ExamCenterService {
  constructor(
    @Inject() private examCenterRepository: ExamCenterRepository,
    @Inject() private checklistService: ChecklistService,
    @Inject() private userService: UserService
  ) { }

  save = async (req: Request, res: Response) => {
    try {
      const examCenter: IExamCenter = req.body;
      const newExamCenter = await this.examCenterRepository.save(examCenter);
      if (!newExamCenter) {
        return responseStatus(res, 500, msg.examCenter.errorInSaving, null);
      }
      return responseStatus(res, 200, msg.examCenter.examCenterSavedSuccess, newExamCenter);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const examCenterData: Partial<IExamCenter> = req.body;
      const updatedExamCenter = await this.examCenterRepository.updateById(id, examCenterData);
      if (!updatedExamCenter) {
        return responseStatus(res, 404, msg.examCenter.examCenterNotFound, null);
      }
      return responseStatus(res, 200, msg.examCenter.examCenterUpdatedSuccess, updatedExamCenter);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedExamCenter = await this.examCenterRepository.deleteById(id);
      if (!deletedExamCenter) {
        return responseStatus(res, 404, msg.examCenter.examCenterNotFound, null);
      }
      return responseStatus(res, 200, msg.examCenter.examCenterDeletedSuccess, {});
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const examCenter = await this.examCenterRepository.findById(id);
      if (!examCenter) {
        return responseStatus(res, 404, msg.examCenter.examCenterNotFound, null);
      }
      return responseStatus(res, 200, msg.examCenter.examCenterFoundSuccess, examCenter);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };


  assignUsersToExamCenter = async (req: Request, res: Response) => {
    try {
      const { examCenterIds, userIds } = req.body;
      console.log(examCenterIds, userIds)
      for (const userId of userIds) {
        await this.userService.updateUserExamCenters(userId, examCenterIds);
      }
      for (const examCenterId of examCenterIds) {
        await this.checklistService.assignUsersToChecklists(examCenterId, userIds);
      }
      return responseStatus(res, 200, msg.user.userUpdatedSuccess, null);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  getAllExamCenters = async (req: Request, res: Response) => {
    try {
      const examCenter = await this.examCenterRepository.findAll();
      if (!examCenter) {
        return responseStatus(res, 404, msg.examCenter.examCenterNotFound, null);
      }
      return responseStatus(res, 200, msg.examCenter.examCenterFoundSuccess, examCenter);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  
}
