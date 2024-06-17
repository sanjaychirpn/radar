import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';
import { UserRoleRepository } from '../repository/userRoleRepository';
import { IUserRole } from '../models/userRoleModel';

@Service()
export class UserRoleService {
  constructor(@Inject() private userRoleRepository: UserRoleRepository) { }

  save = async (req: Request, res: Response) => {
    try {
      const userRole: IUserRole = req.body;
      const newUserRole = await this.userRoleRepository.save(userRole);
      if (!newUserRole) {
        return responseStatus(res, 500, msg.userRole.errorInSaving, null);
      }
      return responseStatus(res, 200, msg.userRole.userRoleSavedSuccess, newUserRole);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userRoleData = req.body;
      const updatedUserRole = await this.userRoleRepository.updateById(id, userRoleData);
      if (!updatedUserRole) {
        return responseStatus(res, 404, msg.userRole.userRoleNotFound, null);
      }
      return responseStatus(res, 200, msg.userRole.userRoleUpdatedSuccess, updatedUserRole);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedUserRole = await this.userRoleRepository.deleteById(id);
      if (!deletedUserRole) {
        return responseStatus(res, 404, msg.userRole.userRoleNotFound, null);
      }
      return responseStatus(res, 200, msg.userRole.userRoleDeletedSuccess, {});
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };
  getUserRoleById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.userRoleRepository.findByid(id);
      if (!data) {
        return responseStatus(res, 404, msg.userRole.userRoleNotFound, null);
      }
      return responseStatus(res, 200, msg.userRole.userRoleDeletedSuccess, data);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };
  getUserRoles = async (req: Request, res: Response) => {
    try {
      const data = await this.userRoleRepository.findAll();
      if (!data) {
        return responseStatus(res, 404, msg.userRole.userRoleNotFound, null);
      }
      return responseStatus(res, 200, msg.userRole.userRoleFound, data);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

}
