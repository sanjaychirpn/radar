import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { EmployeeTypeService } from '../services/employeeTypeService';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

@Service()
export class EmployeeTypeController {
  constructor(@Inject() private employeeTypeService: EmployeeTypeService) {}

  createEmployeeType = async (req: Request, res: Response) => {
    try {
      return await this.employeeTypeService.save(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateEmployeeType = async (req: Request, res: Response) => {
    try {
      return await this.employeeTypeService.update(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  deleteEmployeeType = async (req: Request, res: Response) => {
    try {
      return await this.employeeTypeService.delete(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  getEmployeeTypes= async (req: Request, res: Response) => {
    try {
      return await this.employeeTypeService.getEmployeeTypes(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  getEmployeeTypeById= async (req: Request, res: Response) => {
    try {
      return await this.employeeTypeService.getEmployeeTypeById(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
}
