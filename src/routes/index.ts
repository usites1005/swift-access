import express, { Request, Response } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import adminRoutes from './admin';

const router = express.Router();

// Index
router.get('/', async (_: Request, res: Response) => {
	return res.send('Hello');
});

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;
