import express from 'express';
import { celebrate } from 'celebrate';
import * as validator from '../validation/admin';
import adminController from '../controllers/admin';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// GET-- all admin
router.get('/', AuthMiddleware.adminOnlyAuth, adminController.getAdmins);

// Get logged in admin
router.get('/me', AuthMiddleware.storeAndAdminAuth, adminController.getMe);

// GET-- all store associates
router.get('/stores', AuthMiddleware.adminOnlyAuth, adminController.getStores);

// POST-- create admin
router.post(
  '/',
  [
    celebrate(validator.create, { abortEarly: false }),
    AuthMiddleware.adminOnlyAuth,
  ],
  adminController.create,
);

// PUT | DELETE
router
  .route('/:adminId')
  .put(
    [
      celebrate(validator.update, { abortEarly: false }),
      AuthMiddleware.storeAndAdminAuth,
    ],
    adminController.updateAdmin,
  );

export default router;
