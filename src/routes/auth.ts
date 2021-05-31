import express from 'express';
import { celebrate } from 'celebrate';
import {
	login,
	verifyAccount,
	changePassword,
	forgotPassword,
	resetPassword,
	resendVerificationMail,
} from '../validation/auth';
import AuthController from '../controllers/auth';
import AuthMiddleware from '../middleware/auth';
const router = express.Router();

router.post(
	'/verify',
	celebrate(verifyAccount, { abortEarly: false }),
	AuthController.verifyEmail
);

router.post(
	'/login',
	celebrate(login, { abortEarly: false }),
	AuthController.login
);

router.post(
	'/password/forgot',
	celebrate(forgotPassword, { abortEarly: true }),
	AuthController.forgotPassword
);

router.post(
	'/resendVerification',
	celebrate(resendVerificationMail, { abortEarly: true }),
	AuthController.resendVerificationMail
);

router.post(
	'/password/reset',
	celebrate(resetPassword, { abortEarly: true }),
	AuthController.resetPassword
);

router.post(
	'/password/change',
	[AuthMiddleware.userAuth, celebrate(changePassword, { abortEarly: false })],
	AuthController.changePassword
);


export default router;
