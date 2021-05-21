import { Document } from 'mongoose';

export interface IAdminAccount extends Document {
	id: string;
	adminBTCAddress: string;
	adminETHAddress: string;
	adminTronAddress: string;
	createdAt: string;
	updatedAt: string;
}

export interface AdminAccountPure {
	id?: string;
	adminBTCAddress: string;
	adminETHAddress: string;
	adminTronAddress: string;
}
