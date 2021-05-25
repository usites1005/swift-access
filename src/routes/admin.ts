import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/admin';
import adminController from '../controllers/admin';
import AuthMiddleware from '../middleware/auth';
import userController from '../controllers/user';

const router = express.Router();

// GET-- all admin
router.get('/', AuthMiddleware.adminOnlyAuth, adminController.getAdmins);

// Get logged in admin
router.get('/me', AuthMiddleware.adminOnlyAuth, adminController.getMe);

// POST-- create admin
router.post(
	'/',
	[
		celebrate(validator.create, { abortEarly: false }),
		AuthMiddleware.adminOnlyAuth,
	],
	adminController.create
);

// GET-- all users
router.get('/', AuthMiddleware.adminOnlyAuth, userController.getUsers);

// get user by id
router
	.route('/:userId')
	.get(AuthMiddleware.adminOnlyAuth, userController.getUser);

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

export default router;
