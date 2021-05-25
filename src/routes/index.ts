import express, { Request, Response } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import adminRoutes from './admin';
import analyticsRoutes from './analytics';
import earningsRoutes from './earnings';
import userAccountRoutes from './userAccount';
import withdrawalRoutes from './withdrawal';

const router = express.Router();

// Index
router.get('/', async (_: Request, res: Response) => {
	return res.send('Hello');
});

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/earnings', earningsRoutes);
router.use('/userAccount', userAccountRoutes);
router.use('/withdrawals', withdrawalRoutes);

export default router;
