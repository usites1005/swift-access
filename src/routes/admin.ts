import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/admin';
import * as userDepositValidator from '../validation/deposit';
import * as withdrawalValidator from '../validation/withdrawal';
import * as adminAccountValidator from '../validation/adminAccount';
import UserAccountController from '../controllers/userAccount';
import AdminAccountController from '../controllers/adminAccount';
import WithdrawalController from '../controllers/withdrawal';
import adminController from '../controllers/admin';
import AuthMiddleware from '../middleware/auth';
import EarningsController from '../controllers/earnings';
import AnalyticsController from '../controllers/analytics';
import DepositController from '../controllers/deposit';
import AdminController from '../controllers/admin';

const router = express.Router();

// GET-- all admin address account
router.get('/getAdminAccounts', AdminAccountController.getAdminAccounts);

// GET-- all active admin address account
router.get(
	'/getActiveAdminAccounts',
	AdminAccountController.getActiveAdminAccounts
);

// GET-- all admin
router.get('/', AuthMiddleware.adminOnlyAuth, adminController.getAdmins);

// Get logged in admin
router.get('/me', AuthMiddleware.adminOnlyAuth, adminController.getMe);

// PUT-- update user withdrawal
router.route('/updateToPaid').put(
	celebrate(withdrawalValidator.updateWithdrawalStatus, {
		abortEarly: false,
	}),
	AuthMiddleware.adminOnlyAuth,
	WithdrawalController.updateToPaid
);

// GET-- all users earnings
router
	.route('/earnings')
	.get(AuthMiddleware.adminOnlyAuth, EarningsController.getAllEarnings);

// GET-- analytics
router
	.route('/analytics')
	.get(AuthMiddleware.adminOnlyAuth, AnalyticsController.getAnalyticsAdmin);

// POST-- all users earnings
router
	.route('/releaseDailyROI')
	.post(
		AuthMiddleware.adminOnlyAuth,
		EarningsController.releaseAllValidUsersROIToday
	);

// GET-- all users accounts
router.get(
	'/getAllUsersAccounts',
	AuthMiddleware.adminOnlyAuth,
	UserAccountController.getAllUsersAccounts
);

// POST-- create a user account
router
	.route('/createUserAccount')
	.post(
		celebrate(userDepositValidator.updateDepositStatus, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
		UserAccountController.createUserAccount
	);

// POST-- unconfirmed user deposit
router
	.route('/rejectDeposit')
	.post(
		celebrate(userDepositValidator.unconfirmedDeposit, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
		DepositController.unconfirmedDeposit
	);

// GET-- all users withdrawals
router.get(
	'/withdrawals',
	AuthMiddleware.adminOnlyAuth,
	WithdrawalController.getAllWithdrawals
);

// GET-- all users deposits
router.get(
	'/deposits',
	AuthMiddleware.adminOnlyAuth,
	DepositController.getAllDeposits
);

// GET-- all users unconfirmed deposits
router.get(
	'/unconfirmedDeposits',
	AuthMiddleware.adminOnlyAuth,
	DepositController.getAllUnconfirmedDeposits
);

// add coin address of admin
router
	.route('/addCoinAddress')
	.post(
		celebrate(adminAccountValidator.addCoinAddress, { abortEarly: false }),
		AuthMiddleware.superAdminAuth,
		AdminAccountController.addCoinAddress
	);

// toggleAddressActive
router
	.route('/toggleAddressActive')
	.put(
		celebrate(adminAccountValidator.toggleAddressActive, { abortEarly: false }),
		AuthMiddleware.superAdminAuth,
		AdminAccountController.toggleAddressActive
	);

// toggleAdminActive
router
	.route('/toggleAdminActive')
	.put(
		celebrate(validator.toggleAdminActive, { abortEarly: false }),
		AuthMiddleware.superAdminAuth,
		AdminController.toggleAdminActive
	);

// POST-- create admin
router.post(
	'/',
	[
		celebrate(validator.create, { abortEarly: false }),
		AuthMiddleware.superAdminAuth,
	],
	adminController.create
);

export default router;
