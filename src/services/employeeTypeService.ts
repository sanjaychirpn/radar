import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';
import { EmployeeTypeRepository } from '../repository/employeeTypeRepository';
import { IEmployeeType } from '../models/employeeTypeModel';

@Service()
export class EmployeeTypeService {
  constructor(@Inject() private employeeTypeRepository: EmployeeTypeRepository) { }

  save = async (req: Request, res: Response) => {
    try {
      const employeeType: IEmployeeType = req.body;
      const newEmployeeType = await this.employeeTypeRepository.save(employeeType);
      if (!newEmployeeType) {
        return responseStatus(res, 500, msg.employeeType.errorInSaving, null);
      }
      return responseStatus(res, 200, msg.employeeType.employeeTypeSavedSuccess, newEmployeeType);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employeeTypeData = req.body;
      const updatedEmployeeType = await this.employeeTypeRepository.updateById(id, employeeTypeData);
      if (!updatedEmployeeType) {
        return responseStatus(res, 404, msg.employeeType.employeeTypeNotFound, null);
      }
      return responseStatus(res, 200, msg.employeeType.employeeTypeUpdatedSuccess, updatedEmployeeType);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedEmployeeType = await this.employeeTypeRepository.deleteById(id);
      if (!deletedEmployeeType) {
        return responseStatus(res, 404, msg.employeeType.employeeTypeNotFound, null);
      }
      return responseStatus(res, 200, msg.employeeType.employeeTypeDeletedSuccess, {});
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  getEmployeeTypes = async (req: Request, res: Response) => {
    try {

      const data = await this.employeeTypeRepository.findAll()
      if (!data) {
        return responseStatus(res, 404, msg.employeeType.employeeTypeNotFound, null);
      }
      return responseStatus(res, 200, msg.employeeType.employeeTypeFound, data);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  getEmployeeTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.employeeTypeRepository.findByid(id);
      if (!data) {
        return responseStatus(res, 404, msg.employeeType.employeeTypeNotFound, null);
      }
      return responseStatus(res, 200, msg.employeeType.employeeTypeDeletedSuccess, data);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };
}
