import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import executionRoutes from './execution.routes';
import progressRoutes from './progress.routes';
import certificateRoutes from './certificate.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/execution', executionRoutes);
router.use('/progress', progressRoutes);
router.use('/certificates', certificateRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
