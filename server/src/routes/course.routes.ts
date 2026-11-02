import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { optionalAuthenticate } from '../middleware/optionalAuth.middleware';

const router = Router();

router.get('/', optionalAuthenticate, CourseController.getCourses);
router.get('/slug/:slug', optionalAuthenticate, CourseController.getCourseBySlug);
router.get('/lesson/:id', optionalAuthenticate, CourseController.getLessonById);

export default router;
