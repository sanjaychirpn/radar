import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { UserRoleService } from '../services/userRoleService';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

@Service()
export class UserRoleController {
  constructor(@Inject() private userRoleService: UserRoleService) {}

  createUserRole = async (req: Request, res: Response) => {
    try {
      return await this.userRoleService.save(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateUserRole = async (req: Request, res: Response) => {
    try {
      return await this.userRoleService.update(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  deleteUserRole = async (req: Request, res: Response) => {
    try {
      return await this.userRoleService.delete(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
}
