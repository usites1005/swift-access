import { Document } from 'mongoose';

export interface IACAddresses extends Document {
	id: string;
	adminBTCAddress: string;
	adminETHAddress: string;
	adminTronAddress: string;
	createdAt: string;
	updatedAt: string;
}

export interface ACAddressesPure {
	id?: string;
	adminBTCAddress: string;
	adminETHAddress: string;
	adminTronAddress: string;
}
