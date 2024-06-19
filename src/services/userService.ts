import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';
import { UserRepository } from '../repository/userRepository';
import { IUser } from '../models/userModel';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { jwtSignIN } from '../configuration/config';
import { Types } from 'mongoose';
import { ChecklistRepository } from '../repository/checklistRepository';
import { IChecklist } from '../models/ChecklistModel';
import { EmailService } from './emailService';

@Service()
export class UserService {
  constructor(@Inject() private userRepository: UserRepository,
    @Inject() private checklistRepository: ChecklistRepository,
    @Inject(() => EmailService) private emailService: EmailService) { }

  save = async (req: Request, res: Response) => {
    try {
      const user: IUser = req.body;
      if (!user.email) {
        return responseStatus(res, 400, msg.user.emailRequired, null);
      }
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        return responseStatus(res, 400, msg.user.userEmailExist, null);
      }
      if (!user.password) {
        return responseStatus(res, 400, msg.user.passwordRequired, null);
      }
      user.password = await argon2.hash(user.password);

      const newUser = await this.userRepository.save(user);
      if (!newUser) {
        return responseStatus(res, 500, msg.user.errorInSaving, null);
      }

      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, jwtSignIN.secret);
      return responseStatus(res, 200, msg.user.userSavedSuccess, { token, user: newUser });
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  // login = async (req: Request, res: Response) => {
  //   try {
  //     const { email, password }: IUser = req.body;
  //     const user = await this.userRepository.findByEmail(email);
  //     if (!user) {
  //       return responseStatus(res, 401, msg.user.userNotFound, null);
  //     }
  //     const passwordMatch = await argon2.verify(user.password, password);
  //     if (!passwordMatch) {
  //       return responseStatus(res, 401, msg.user.invalidCredentials, null);
  //     }
  //     const token = jwt.sign({ userId: user._id, role: user.role }, jwtSignIN.secret);
  //     return responseStatus(res, 200, msg.user.loggedInSuccess, { token, user });
  //   } catch (error) {
  //     console.error(error);
  //     return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
  //   }
  // };
  async login(email: string, password: string): Promise<{ user: IUser; token: string; checklists: IChecklist[] } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSignIN.secret);

    let checklists: IChecklist[] = [];
    if (user.examCenters && user.examCenters.length > 0) {
      for (const examCenterId of user.examCenters) {
        const centerChecklists = await this.checklistRepository.findByExamCenterAndUser(examCenterId.toString(), user._id.toString());
        checklists = checklists.concat(centerChecklists);
      }
    }
    
    return { user, token, checklists };
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userRepository.updateById(id, userData);
      if (!updatedUser) {
        return responseStatus(res, 404, msg.user.userNotFound, null);
      }
      return responseStatus(res, 200, msg.user.userUpdatedSuccess, updatedUser);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userRepository.findAll();
      if (!users) {
        return responseStatus(res, 404, msg.user.userNotFound, null);
      }
      return responseStatus(res, 200, msg.user.userFoundSuccess, users);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedUser = await this.userRepository.deleteById(id);
      if (!deletedUser) {
        return responseStatus(res, 404, msg.user.userNotFound, null);
      }
      return responseStatus(res, 200, msg.user.userDeletedSuccess, {});
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };
  findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);
      if (!user) {
        return responseStatus(res, 404, msg.user.userNotFound, null);
      }
      return responseStatus(res, 200, msg.user.userFoundSuccess, user);
    } catch (error) {
      console.error(error);
      return responseStatus(res, 500, msg.common.somethingWentWrong, 'An unknown error occurred');
    }
  };

  async updateUserExamCenters(userId: string, examCenterIds: string[]): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Ensure no duplicate exam center assignments
    const uniqueExamCenterIds = Array.from(new Set([...user.examCenters, ...examCenterIds]));

    const updatedUser = await this.userRepository.updateById(userId, { examCenters: uniqueExamCenterIds } as Partial<IUser>);

    // if (updatedUser) {
    //   await this.emailService.sendAssignmentEmail(updatedUser.email, updatedUser.name, examCenterIds);
    // }
    return updatedUser;
  }

  updateFCMFields = async (id: string, fields: { FCMToken: string; FCMId: string }) => {
    const updatedUser = await this.userRepository.updateById(id, fields);
    return updatedUser;
  };

  async getAllProctorsByExamCenterId(id: string): Promise<IUser[]> {
    return this.userRepository.findUsersByExamCenterAndRole(id, 'proctor');
  }

  async getAllSupervisorsByExamCenterId(id: string): Promise<IUser[]> {
    return this.userRepository.findUsersByExamCenterAndRole(id, 'supervisor');
  }

}
