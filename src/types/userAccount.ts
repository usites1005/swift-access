import { Document } from 'mongoose';

export interface IUserAccount extends Document {
	id: string;
	userId: string;
	amountDeposited: number;
	earnedROI: number;
	referralBonus: number;
	leadershipBonus: number;
	totalWithdrawal: number;
	accountBalance: number;
	createdAt: string;
	updatedAt: string;
}

export interface UserAccountPure {
  id?: string;
	userId: string;
	amountDeposited: number;
	earnedROI: number;
	referralBonus: number;
	leadershipBonus: number;
	totalWithdrawal: number;
	accountBalance: number;
}