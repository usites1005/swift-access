import { Document } from 'mongoose';
import { IUser } from './user';

export interface IAdmin extends Document {
	id: string;
	fullName: string;
	username: string;
	email: string;
	// phone: string;
	password: string;
	imageURL: string;
	role: string;
	isSuper: boolean;
  isVerified: boolean;
  createdAt: string;
	updatedAt: string;
}

export enum AdminEnumType {
	STORE = 'Store',
	ADMIN = 'Admin',
}

export enum LocationEnumType {
	NIGERIA = 'Nigeria',
	KENYA = 'Kenya',
}

export interface IAdminLogin {
	email: string;
	password: string;
}
export type UserType = string | IAdmin;

export type IAllUsers = IAdmin & IUser & null;

export interface AdminPure {
	id?: string;
	fullName: string;
	username: string;
	email: string;
	password: string;
	imageURL: string;
	role: string;
  isSuper: boolean;
  isVerified: boolean;
}
