import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSignIN } from '../configuration/config';
import User from '../models/userModel';
import Admin from '../models/adminModel';
import { responseStatus } from '../helper/responses';
import { msg } from '../helper/messages';

export const checkJWT = (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return responseStatus(res, 403, msg.token.tokenNotFound, {});
        }
        const decode = jwt.verify(token, jwtSignIN.secret);
        if (!decode) {
            return responseStatus(res, 400, msg.token.invalid, {});
        }
        req.user = { payload: decode };
        return next();
    } catch (error) {
        return responseStatus(res, 400, msg.token.error, {});
    }
};

export const checkAdmin = async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {
        let role = req.user?.payload?.role || '';
        if (role?.includes('ADMIN')) {
            next();
        } else {
            return responseStatus(res, 400, msg.token.accessDenied, {});
        }
    } catch (error) {
        return responseStatus(res, 400, msg.token.error, {});
    }
};
