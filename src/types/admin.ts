import { Document } from 'mongoose';
import { IUser } from './user';

export interface IAdmin extends Document {
	id: string;
	fullName: string;
	username: string;
	email: string;
	password: string;
	imageURL: string;
	isSuper: boolean;
	createdAt: string;
	updatedAt: string;
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
	isSuper: boolean;
}
