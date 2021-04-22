import { Document } from 'mongoose';
import { LocationEnumType } from './admin';

export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: LocationEnumType;
  password: string;
  imageURL: string;
  role?: string;
  isVerified: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ILogin {
  email: string;
  password: string;
}
export type UserType = string | IUser;
