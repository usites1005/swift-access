import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/withdrawal';
import WithdrawalController from '../controllers/withdrawal';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();
// POST-- make a user withdrawal
router
	.route('/makeWithdrawal')
	.post(
		celebrate(validator.withdrawalRequest, { abortEarly: false }),
		AuthMiddleware.userAuth,
		WithdrawalController.makeWithdrawal
	);

// GET-- all users withdrawals
router
	.route('/getAllUserWithdrawals')
	.get(AuthMiddleware.userAuth, WithdrawalController.getAllUserWithdrawals);

// GET-- all users withdrawals
router.get(
	'/getAllWithdrawals',
	AuthMiddleware.adminOnlyAuth,
	WithdrawalController.getAllWithdrawals
);

// PUT-- all users withdrawals
router
	.route('/updateToPaid')
	.put(
		celebrate(validator.updateWithdrawalStatus, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
		WithdrawalController.updateToPaid
	);

export default router;
