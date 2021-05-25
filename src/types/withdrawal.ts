import { Document } from 'mongoose';

export interface IWithdrawal extends Document {
	id: string;
	userId: string;
	// accountId: string;
	dollarAmount: number;
	destination: string;
	sender: string;
	comment: string;
	status: string;
	paidAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface WithdrawalPure {
  userId: string;
  // accountId: string;
	dollarAmount: number;
	destination: string;
	sender: string;
	comment: string;
}

export enum WithdrawalStatusEnum {
	PENDING = 'Pending',
	PAID = 'Paid',
}
