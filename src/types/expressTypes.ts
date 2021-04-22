import { Request } from 'express';
import { IAdmin } from './admin';
import { IUser } from './user';

export type TAllUsers = IAdmin & IUser;

interface IRequest extends Request {
  user?: TAllUsers;
  sub?: string;
}

export default IRequest;
