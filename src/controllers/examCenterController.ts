import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ExamCenterService } from '../services/examCenterService';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

@Service()
export class ExamCenterController {
  constructor(@Inject() private examCenterService: ExamCenterService) {}

  saveExamCenter = async (req: Request, res: Response) => {
    try {
      const examCenter = await this.examCenterService.save(req, res);
      return examCenter;
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateExamCenter = async (req: Request, res: Response) => {
    try {
      const updatedExamCenter = await this.examCenterService.update(req, res);
      return updatedExamCenter;
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  deleteExamCenter = async (req: Request, res: Response) => {
    try {
      const deletedExamCenter = await this.examCenterService.delete(req, res);
      return deletedExamCenter;
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  findExamCenterById = async (req: Request, res: Response) => {
    try {
      const examCenter = await this.examCenterService.findById(req, res);
      return examCenter;
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  assignUsersToExamCenter = async (req: Request, res: Response) => {
    try {
      const result = await this.examCenterService.assignUsersToExamCenter(req, res);
      return result;
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
}
