import { Document } from 'mongoose';

export interface IAdminAccount extends Document {
	id: string;
	adminId: string;
	currency: string;
	address: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AdminAccountPure {
	id?: string;
	currency: string;
	address: string;
	adminId: string;
}

export enum CurrencyEnum {
	BTC = 'BTC',
	ETH = 'ETH',
	TRON = 'TRON',
}
