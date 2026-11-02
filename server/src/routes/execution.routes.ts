import { Router } from 'express';
import { ExecutionController, runCodeSchema, submitExerciseSchema } from '../controllers/execution.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { executionLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Test run code in playground (can run unauthenticated for quick trials, or authenticated)
router.post('/run', executionLimiter, validate(runCodeSchema), ExecutionController.runCode);

// Submit and grade code against unit test suite (requires student login to record progress)
router.post('/submit', executionLimiter, authenticate, validate(submitExerciseSchema), ExecutionController.submitExercise);

export default router;
