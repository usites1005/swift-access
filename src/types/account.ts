import { Document } from 'mongoose';

export interface IAccountHistory extends Document {
	id: string;
	type: string;
	amount: number;
	comment: string;
	accountBalance: number;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}

export interface AccountHistoryPure {
	id?: string;
	type: string;
	amount: number;
	comment: string;
	accountBalance: number;
}
