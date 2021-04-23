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
  userController.signUp,
);

// GET-- all users
router.get('/' /*, AuthMiddleware.adminOnlyAuth */, userController.getUsers);

// get logged in user
router
  .route('/me')
  .get(AuthMiddleware.userAuth, userController.getMe)
  .put(
    celebrate(validator.update, { abortEarly: false }),
    AuthMiddleware.userAuth,
    userController.updateUser,
  );

// get user by id
router
  .route('/:userId')
  .get(AuthMiddleware.adminOnlyAuth, userController.getUser);

export default router;
