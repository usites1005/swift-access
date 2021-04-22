import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import QueryBuilder from '../common/querybuilder';
import sendResponse from '../common/response';
import UserService from '../services/user';
import IRequest from '../types/expressTypes';
import IQuery from '../types/queryTypes';

class AnalyticsController {
  static async getUsersData(req: IRequest, res: Response, next: NextFunction) {
    try {
      // get query list
      let queryTimeline = new QueryBuilder(req.query as IQuery).parseTimeline();
      const userCount = await UserService.queryUser({
        createdAt: queryTimeline.query!,
        location: req.user?.location,
      });
      res.json(
        sendResponse(httpStatus.OK, 'Success', {
          userCount,
        }),
      );
    } catch (err) {
      next(err);
    }
  }
}

export default AnalyticsController;
