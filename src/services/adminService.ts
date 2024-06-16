import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';
import { AdminRepository } from '../repository/adminRepository';
import { IAdmin } from '../models/adminModel';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { jwtSignIN } from '../configuration/config';

@Service()
export class AdminService {
  constructor(@Inject() private adminRepository: AdminRepository) {}

  save = async (req: Request, res: Response) => {
    try {
      const admin: IAdmin = req.body;
      if (!admin.email) {
        return responseStatus(res, 400, msg.user.emailRequired, null);
      }
      const existingAdmin = await this.adminRepository.findByEmail(admin.email);
      if (existingAdmin) {
        return responseStatus(res, 400, msg.user.userEmailExist, null);
      }
      if (!admin.password) {
        return responseStatus(res, 400, msg.user.passwordRequired, null);
      }
      admin.password = await argon2.hash(admin.password);

      const newAdmin = await this.adminRepository.save(admin);
      if (!newAdmin) {
        return responseStatus(res, 500, msg.user.errorInSaving, null);
      }

       const token = jwt.sign({ userId: newAdmin._id, role: newAdmin.role }, jwtSignIN.secret);
      return responseStatus(res, 200, msg.user.userSavedSuccess, { token, admin: newAdmin });
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password }: IAdmin = req.body;
      const admin = await this.adminRepository.findByEmail(email);
      if (!admin) {
        return responseStatus(res, 401, msg.user.userNotFound, null);
      }
      const passwordMatch = await argon2.verify(admin.password, password);
      if (!passwordMatch) {
        return responseStatus(res, 401, msg.user.invalidCredentials, null);
      }
       const token = jwt.sign({ userId: admin._id, role: admin.role }, jwtSignIN.secret);
      return responseStatus(res, 200, msg.user.loggedInSuccess, { token, admin });
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const adminData = req.body;
      const updatedAdmin = await this.adminRepository.updateById(id, adminData);
      if (!updatedAdmin) {
        return responseStatus(res, 404, msg.user.userNotFound, null);
      }
      return responseStatus(res, 200, msg.user.userUpdatedSuccess, updatedAdmin);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedAdmin = await this.adminRepository.deleteById(id);
      if (!deletedAdmin) {
        return responseStatus(res, 404, msg.user.userNotFound, null);
      }
      return responseStatus(res, 200, msg.user.userDeletedSuccess, {});
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };
}
