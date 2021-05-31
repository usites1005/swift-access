import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/admin';
import * as userAccountValidator from '../validation/userAccount';
import * as withdrawalValidator from '../validation/withdrawal';
import UserAccountController from '../controllers/userAccount';
import WithdrawalController from '../controllers/withdrawal';
import adminController from '../controllers/admin';
import AuthMiddleware from '../middleware/auth';
import EarningsController from '../controllers/earnings';

const router = express.Router();

// GET-- all admin
router.get('/', AuthMiddleware.adminOnlyAuth, adminController.getAdmins);

// POST-- admin login
router.post(
	'/login',
	[celebrate(validator.login, { abortEarly: false })],
	adminController.login
);

router.post(
	'/password/forgot',
	celebrate(validator.forgotPassword, { abortEarly: true }),
	adminController.forgotPassword
);

router.post(
	'/password/reset',
	celebrate(validator.resetPassword, { abortEarly: true }),
	adminController.resetPassword
);

router.post(
	'/password/change',
	[
		AuthMiddleware.superAdminAuth,
		celebrate(validator.changePassword, { abortEarly: false }),
	],
	adminController.changePassword
);

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
