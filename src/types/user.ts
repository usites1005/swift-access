import { Document } from 'mongoose';

export interface IUser extends Document {
	id: string;
	fullName: string;
	username: string;
	bitcoinA: string;
	sQuestion: string;
	sAnswer: string;
	email: string;
	// phone: string;
	password: string;
	imageURL: string;
	refBy: string;
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

export interface UserPure {
  id?: string;
	fullName: string;
	username: string;
	bitcoinA: string;
	sQuestion: string;
	sAnswer: string;
	email: string;
	password: string;
  imageURL: string;
	refBy: string;
	isVerified: boolean;
}


export interface IUserToken {
  id: string;
  email: string;
  tokenFor: string;
}