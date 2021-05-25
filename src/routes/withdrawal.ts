import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/user';
import userController from '../controllers/user';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// POST-- user signUp.
router.post(
	'/',
	celebrate(validator.signup, { abortEarly: false }),
	userController.signUp
);

// add coin address of logged in user
router
	.route('/me')
	.put(
		celebrate(validator.addCoinAddress, { abortEarly: false }),
		AuthMiddleware.userAuth,
		userController.addCoinAddress
	);

// get logged in user
router.route('/me').put(AuthMiddleware.userAuth, userController.getMe);

// get user's referrals
router
	.route('/referrals')
	.get(AuthMiddleware.userAuth, userController.getUserReferrals);

// get user by id
router
	.route('/:userId')
	.get(AuthMiddleware.adminOnlyAuth, userController.getUser);

export default router;
