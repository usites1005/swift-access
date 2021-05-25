import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/userAccount';
import UserAccountController from '../controllers/userAccount';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// GET-- all user accounts
router
	.route('/getAllUserAccounts')
	.get(AuthMiddleware.userAuth, UserAccountController.getAllUserAccounts);

// GET-- all users accounts
router.get(
	'/getUserAccounts',
	AuthMiddleware.adminOnlyAuth,
	UserAccountController.getUserAccounts
);

// POST-- create a user account
router
	.route('/createUserAccount')
	.post(
		celebrate(validator.createUserAccount, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
		UserAccountController.createUserAccount
	);

export default router;
