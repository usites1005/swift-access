import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AdminService from '../services/admin';
import sendResponse from '../common/response';
import APIError from '../common/APIError';
// import EmailService from '../services/email';
import IRequest from '../types/general';
import TokenService from '../services/token';

export default class AdminController {
  static async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getAdmins(req);
      res.json(sendResponse(httpStatus.OK, 'Admins found', users));
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: IRequest, res: Response, next: NextFunction) {
    try {
      let _id = req.user?._id;
      const user = await AdminService.getAdmin({ _id });
      if (!user) {
        throw new APIError({
          message: 'Admin not found',
          status: httpStatus.NOT_FOUND,
        });
      }
      res.json(sendResponse(httpStatus.OK, 'Admin found', user));
    } catch (err) {
      next(err);
    }
  }

  static async create(req: IRequest, res: Response, next: NextFunction) {
    try {
      const admin = req.user;
      const data = req.body;
      const password = TokenService.generateCode();
      const newAdmin = await AdminService.create({
        ...data,
        password,
        createdBy: admin,
      });

      res.json(
        sendResponse(httpStatus.CREATED, 'Admin created successfully', newAdmin),
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
      const adminId = req.user?._id;
      const id = req.params.adminId;
      const isSuperAdmin = req.user?.isSuper;
      let { isSuper, ...body } = req.body;

      let admin;
      if (isSuperAdmin) {
        admin = await AdminService.updateAdmin({ ...req.body, id });
      } else {
        if (id !== adminId) {
          throw new APIError({
            message: `Unauthorized Admin`,
            status: httpStatus.UNAUTHORIZED,
          });
        }
        // if (req.user?.phone) delete body.phone;
        admin = await AdminService.updateAdmin({ ...body, id });
      }
      if (!admin) {
        throw new APIError({
          message: 'Admin not found',
          status: httpStatus.NOT_FOUND,
        });
      }
      res.json(sendResponse(httpStatus.OK, 'Admin updated', admin));
    } catch (err) {
      next(err);
    }
  }
}
