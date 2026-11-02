import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.service';
import { CertificateService } from '../services/certificate.service';
import { ApiError } from '../middleware/error.middleware';

export const toggleProgressSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'Lesson ID is required'),
    completed: z.boolean()
  })
});

export const saveNoteSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'Lesson ID is required'),
    content: z.string()
  })
});

export const addBookmarkSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'Lesson ID is required'),
    timestamp: z.number().min(0),
    title: z.string().min(1, 'Title is required')
  })
});

export class ProgressController {
  public static async toggleLessonCompletion(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId, completed } = req.body;
      const userId = req.user!.userId;

      const progress = await prisma.userProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId }
        },
        update: {
          completed,
          updatedAt: new Date()
        },
        create: {
          userId,
          lessonId,
          completed
        }
      });

      // Check if course is 100% completed
      let certificate = null;
      let courseCompleted = false;

      if (completed) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: {
            module: {
              include: {
                course: {
                  include: {
                    modules: {
                      include: {
                        lessons: { select: { id: true } }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        if (lesson) {
          const allLessonIds: string[] = [];
          lesson.module.course.modules.forEach(m => m.lessons.forEach(l => allLessonIds.push(l.id)));

          const completedCount = await prisma.userProgress.count({
            where: {
              userId,
              lessonId: { in: allLessonIds },
              completed: true
            }
          });

          if (completedCount === allLessonIds.length) {
            courseCompleted = true;
            certificate = await CertificateService.issueCertificate(userId, lesson.module.course.id);
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          progress,
          courseCompleted,
          certificate
        }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async saveNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId, content } = req.body;
      const userId = req.user!.userId;

      const note = await prisma.note.upsert({
        where: {
          userId_lessonId: { userId, lessonId }
        },
        update: {
          content,
          updatedAt: new Date()
        },
        create: {
          userId,
          lessonId,
          content
        }
      });

      return res.status(200).json({
        success: true,
        data: { note }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async addBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId, timestamp, title } = req.body;
      const userId = req.user!.userId;

      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          lessonId,
          timestamp,
          title
        }
      });

      return res.status(201).json({
        success: true,
        data: { bookmark }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const existing = await prisma.bookmark.findUnique({
        where: { id }
      });

      if (!existing || existing.userId !== userId) {
        throw new ApiError(404, 'Bookmark not found or access denied');
      }

      await prisma.bookmark.delete({
        where: { id }
      });

      return res.status(200).json({
        success: true,
        message: 'Bookmark deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}
