import { Document } from 'mongoose';

export interface IWithdrawal extends Document {
	id: string;
	userId: string;
	dollarAmount: number;
	destinationAddr: string;
	comment: string;
	status: string;
	paidAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface WithdrawalPure {
	userId: string;
	dollarAmount: number;
	destinationAddr: string;
	comment: string;
}

export enum WithdrawalStatusEnum {
	PENDING = 'Pending',
	PAID = 'Paid',
}
