import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/user';
import * as withdrawalValidator from '../validation/withdrawal';
import userController from '../controllers/user';
import WithdrawalController from '../controllers/withdrawal';
import AnalyticsController from '../controllers/analytics';
import AuthMiddleware from '../middleware/auth';
import EarningsController from '../controllers/earnings';
import UserAccountController from '../controllers/userAccount';

const router = express.Router();

// POST-- user signUp.
router.post(
	'/',
	celebrate(validator.signup, { abortEarly: false }),
	userController.signUp
);

// add coin address of logged in user
router
	.route('/address')
	.put(
		celebrate(validator.addCoinAddress, { abortEarly: false }),
		AuthMiddleware.userAuth,
		userController.addCoinAddress
	);

// get logged in user
router.route('/me').get(AuthMiddleware.userAuth, userController.getMe);

// get user's referrals
router
	.route('/referrals')
	.get(AuthMiddleware.userAuth, userController.getUserReferrals);

//get user analytics
router.get(
	'/analytics',
	AuthMiddleware.userAuth,
	AnalyticsController.getUserData
);

// GET-- all user earnings
router.get(
	'/earnings',
	AuthMiddleware.userAuth,
	EarningsController.getUserEarnings
);

// GET-- all user accounts
router
	.route('/getUserAccounts')
	.get(AuthMiddleware.userAuth, UserAccountController.getUserAccounts);

// POST-- make a user withdrawal
router
	.route('/makeWithdrawal')
	.post(
		celebrate(withdrawalValidator.withdrawalRequest, { abortEarly: false }),
		AuthMiddleware.userAuth,
		WithdrawalController.makeWithdrawal
	);

// GET-- all users withdrawals
router
	.route('/getUserWithdrawals')
	.get(AuthMiddleware.userAuth, WithdrawalController.getUserWithdrawals);

// get user by id
router
	.route('/:userId')
	.get(AuthMiddleware.adminOnlyAuth, userController.getUser);

// GET-- all users
router.get('/', AuthMiddleware.adminOnlyAuth, userController.getUsers);

export default router;
