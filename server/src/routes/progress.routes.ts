import { Router } from 'express';
import {
  ProgressController,
  toggleProgressSchema,
  saveNoteSchema,
  addBookmarkSchema
} from '../controllers/progress.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/toggle', validate(toggleProgressSchema), ProgressController.toggleLessonCompletion);
router.post('/note', validate(saveNoteSchema), ProgressController.saveNote);
router.post('/bookmark', validate(addBookmarkSchema), ProgressController.addBookmark);
router.delete('/bookmark/:id', ProgressController.deleteBookmark);

export default router;
