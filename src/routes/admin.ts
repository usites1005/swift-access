import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/admin';
import * as userAccountValidator from '../validation/userAccount';
import * as withdrawalValidator from '../validation/withdrawal';
import * as adminAccountValidator from '../validation/adminAccount';
import UserAccountController from '../controllers/userAccount';
import AdminAccountController from '../controllers/adminAccount';
import WithdrawalController from '../controllers/withdrawal';
import adminController from '../controllers/admin';
import AuthMiddleware from '../middleware/auth';
import EarningsController from '../controllers/earnings';

const router = express.Router();

// GET-- all admin address account
router.get('/getAdminAccounts', AdminAccountController.getAdminAccounts);

// GET-- all admin
router.get('/', AuthMiddleware.adminOnlyAuth, adminController.getAdmins);

// Get logged in admin
router.get('/me', AuthMiddleware.adminOnlyAuth, adminController.getMe);

// PUT
router
	.route('/:adminId')
	.put(
		[
			celebrate(validator.update, { abortEarly: false }),
			AuthMiddleware.adminOnlyAuth,
		],
		adminController.updateAdmin
	);

// GET-- all users earnings
router
	.route('/earnings')
	.get(AuthMiddleware.adminOnlyAuth, EarningsController.getAllEarnings);

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
		celebrate(userAccountValidator.createUserAccount, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
		UserAccountController.createUserAccount
	);

// // POST-- create admin crypto address account
// router
// 	.route('/createAdminAccount')
// 	.post(
// 		celebrate(adminAccountValidator.createAdminAccount, { abortEarly: false }),
// 		AuthMiddleware.adminOnlyAuth,
// 		AdminAccountController.createAdminAccount
// 	);

// add coin address of logged in user
router
	.route('/addCoinAddress')
	.post(
		celebrate(adminAccountValidator.addCoinAddress, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
		AdminAccountController.addCoinAddress
	);

// GET-- all users withdrawals
router.get(
	'/getAllWithdrawals',
	AuthMiddleware.adminOnlyAuth,
	WithdrawalController.getAllWithdrawals
);

// PUT-- all users withdrawals
router.route('/updateToPaid').put(
	celebrate(withdrawalValidator.updateWithdrawalStatus, {
		abortEarly: false,
	}),
	AuthMiddleware.adminOnlyAuth,
	WithdrawalController.updateToPaid
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
