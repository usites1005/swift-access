import { Document } from 'mongoose';

export interface IAccountHistory extends Document {
	id: string;
	userId: string;
	type: string;
	amount: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
}

export interface AccountHistoryPure {
  id?: string;
  userId: string;
	type: string;
	amount: number;
	comment: string;
	accountBalance: number;
}
