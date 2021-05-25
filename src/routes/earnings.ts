import express from 'express';
import EarningsController from '../controllers/earnings';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// GET-- all user earnings
router.get(
	'/getUserEarnings',
	AuthMiddleware.userAuth,
	EarningsController.getUserEarnings
);

// GET-- all users earnings
router
	.route('/getAllEarnings')
	.get(AuthMiddleware.adminOnlyAuth, EarningsController.getAllEarnings);

// POST-- all users earnings
router
	.route('/releaseDailyROI')
	.post(
		AuthMiddleware.adminOnlyAuth,
		EarningsController.releaseAllValidUsersROIToday
	);

export default router;
