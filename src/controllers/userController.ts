import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { UserService } from '../services/userService';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  save = async (req: Request, res: Response) => {
    try {
      return await this.userService.save(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      if (result) {
        return responseStatus(res, 200, msg.user.loggedInSuccess, result);
      } else {
        return responseStatus(res, 401, msg.user.invalidCredentials, null);
      }
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      return await this.userService.update(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
  

  deleteUser = async (req: Request, res: Response) => {
    try {
      return await this.userService.delete(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
  findUserById = async (req: Request, res: Response) => {
    try {
      return await this.userService.findById(req, res);
    } catch (error) {
      return responseStatus(res, 500, msg.common.somethingWentWrong, error);
    }
  };
 
}
