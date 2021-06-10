import { Document } from 'mongoose';
import { TAllUsers } from './general';

export interface IUser extends Document {
	id: string;
	fullName: string;
	username: string;
	btcAddr: string;
	ethAddr: string;
	tronAddr: string;
	email: string;
	// phone: string;
	password: string;
	imageURL: string;
	refBy: string;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ILogin {
	email: string;
	password: string;
}
export type UserType = string | IUser;

export interface UserPure {
	id?: string;
	fullName: string;
	username: string;
	btcAddr: string;
	ethAddr: string;
	tronAddr: string;
	email: string;
	password: string;
	imageURL: string;
	refBy: string;
	isVerified: boolean;
}

export interface IUserToken {
	user: TAllUsers;
	tokenFor: string;
}
