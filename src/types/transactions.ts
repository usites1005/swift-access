import { Document } from 'mongoose';

export interface ITransactions extends Document {
	id: string;
	userId: string;
	type: string;
	currency: string;
	amount: number;
	coinAmount: number;
	destination: string;
	sender: string;
	comment: string;
	status: string;
	confirmedAt: string;
	createdAt: string;
	updatedAt: string;
}

export enum ConfirmationStatusEnum {
	PENDING = 'Pending',
	CONFIRMED = 'Confirmed',
}
