import express from 'express';
import AnalyticsController from '../controllers/analytics';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// GET-- all users
router.get('/users', AuthMiddleware.userAuth, AnalyticsController.getUserData);

export default router;
