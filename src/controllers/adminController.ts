import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { AdminService } from '../services/adminService';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

@Service()
export class AdminController {
  constructor(@Inject() private adminService: AdminService) { }

  registerAdmin = async (req: Request, res: Response) => {
    try {
      return await this.adminService.save(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  loginAdmin = async (req: Request, res: Response) => {
    try {
      return await this.adminService.login(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateAdmin = async (req: Request, res: Response) => {
    try {
      return await this.adminService.update(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  deleteAdmin = async (req: Request, res: Response) => {
    try {
      return await this.adminService.delete(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
  getAllUsers = async (req: Request, res: Response) => {
    try {
      return await this.adminService.getAllUsers(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      return await this.adminService.getUserById(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
}
