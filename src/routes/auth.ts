import express from 'express';
import { celebrate } from 'celebrate';
import {
  login,
  verifyAccount,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../validation/auth';
import AuthController from '../controllers/auth';
import AuthMiddleware from '../middleware/auth';
const router = express.Router();

router.post(
  '/verify',
  celebrate(verifyAccount, { abortEarly: false }),
  AuthController.verifyEmail,
);

router.post(
  '/login/:type',
  celebrate(login, { abortEarly: false }),
  AuthController.login,
);

router.post(
  '/password/forgot/:type',
  celebrate(forgotPassword, { abortEarly: true }),
  AuthController.forgotPassword,
);

router.post(
  '/password/reset/:type',
  celebrate(resetPassword, { abortEarly: true }),
  AuthController.resetPassword,
);

router.post(
  '/password/change/user',
  [AuthMiddleware.userAuth, celebrate(changePassword, { abortEarly: false })],
  AuthController.changePassword,
);

router.post(
  '/password/change/admin',
  [
    AuthMiddleware.superAdminAuth,
    celebrate(changePassword, { abortEarly: false }),
  ],
  AuthController.changePassword,
);

// router.post('/resend-token/:id', AuthController.resendToken);

export default router;
