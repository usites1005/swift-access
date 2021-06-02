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
import * as adminValidator from '../validation/admin';
import AuthController from '../controllers/auth';
import adminController from '../controllers/admin';
import AuthMiddleware from '../middleware/auth';
const router = express.Router();

router.post(
	'/verify',
	celebrate(verifyAccount, { abortEarly: false }),
	AuthController.verifyEmail
);

router.post(
	'/login/user',
	celebrate(login, { abortEarly: false }),
	AuthController.login
);

router.post(
	'/password/forgot/user',
	celebrate(forgotPassword, { abortEarly: true }),
	AuthController.forgotPassword
);

router.post(
	'/resendVerification',
	celebrate(resendVerificationMail, { abortEarly: true }),
	AuthController.resendVerificationMail
);

router.post(
	'/password/reset/user',
	celebrate(resetPassword, { abortEarly: true }),
	AuthController.resetPassword
);

// POST-- admin login
router.post(
	'/login/admin',
	[celebrate(adminValidator.login, { abortEarly: false })],
	adminController.login
);

router.post(
	'/password/forgot/admin',
	celebrate(adminValidator.forgotPassword, { abortEarly: true }),
	adminController.forgotPassword
);

router.post(
	'/password/reset/admin',
	celebrate(adminValidator.resetPassword, { abortEarly: true }),
	adminController.resetPassword
);

router.post(
	'/password/change/user',
	[AuthMiddleware.userAuth, celebrate(changePassword, { abortEarly: false })],
	AuthController.changePassword
);

router.post(
	'/password/change/admin',
	[
		AuthMiddleware.adminOnlyAuth,
		celebrate(adminValidator.changePassword, { abortEarly: false }),
	],
	adminController.changePassword
);

// router.post(
//   '/password/change/admin',
//   [
//     AuthMiddleware.adminOnlyAuth,
//     celebrate(changePassword, { abortEarly: false }),
//   ],
//   AuthController.changePassword,
// );

export default router;
