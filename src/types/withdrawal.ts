import { Document } from 'mongoose';

export interface ITransactions extends Document {
	id: string;
	userId: string;
	dollarAmount: number;
	destination: string;
	sender: string;
	comment: string;
	status: string;
	confirmedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface TransactionsPure {
	userId: string;
	dollarAmount: number;
	destination: string;
	sender: string;
	comment: string;
}

export enum ConfirmationStatusEnum {
	PENDING = 'Pending',
	PAID = 'Paid',
}
