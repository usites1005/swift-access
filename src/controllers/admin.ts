import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AdminService from '../services/admin';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
import EmailService from '../services/email';
import IRequest from '../types/expressTypes';
import TokenService from '../services/token';

export default class AdminController {
  static async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getAdmins(req);
      res.json(sendResponse(httpStatus.OK, 'Users found', users));
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: IRequest, res: Response, next: NextFunction) {
    try {
      let _id = req.sub;
      const user = await AdminService.getAdmin({ _id });
      if (!user) {
        throw new APIError({
          message: 'User not found',
          status: httpStatus.NOT_FOUND,
        });
      }
      res.json(sendResponse(httpStatus.OK, 'User found', user));
    } catch (err) {
      next(err);
    }
  }

  static async create(req: IRequest, res: Response, next: NextFunction) {
    try {
      const admin = req.user;
      const data = req.body;
      const password = TokenService.generateCode();
      const newUser = await AdminService.create({
        ...data,
        password,
        location: admin?.location,
        createdBy: admin,
      });

      // send mail with login details
      EmailService.sendLoginDetails(newUser, password);

      res.json(
        sendResponse(httpStatus.CREATED, 'User created successfully', newUser),
      );
    } catch (err) {
      next(
        new APIError({
          message: err.message,
          status: 400,
        }),
      );
    }
  }
  static async updateAdmin(req: IRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.sub;
      const id = req.params.adminId;
      const isSuperAdmin = req.user?.isSuper;
      const adminRole = req.user?.role;
      let { isSuper, role, ...body } = req.body;
      // check that phone number is never taken
      const phoneTaken = await AdminService.getAdmin({ phone: body.phone });
      if (phoneTaken) {
        throw new APIError({
          message: `Phone number is in use by another user`,
          status: httpStatus.BAD_REQUEST,
        });
      }
      let admin;
      if (isSuperAdmin) {
        admin = await AdminService.updateAdmin({ ...req.body, id });
      } else {
        if (id !== adminId) {
          throw new APIError({
            message: `Unauthorized ${adminRole} User`,
            status: httpStatus.UNAUTHORIZED,
          });
        }
        if (req.user?.phone) delete body.phone;
        admin = await AdminService.updateAdmin({ ...body, id });
      }
      if (!admin) {
        throw new APIError({
          message: 'User not found',
          status: httpStatus.NOT_FOUND,
        });
      }
      res.json(sendResponse(httpStatus.OK, 'User updated', admin));
    } catch (err) {
      next(err);
    }
  }
}
