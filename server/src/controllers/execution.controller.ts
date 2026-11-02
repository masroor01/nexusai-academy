import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.service';
import { SandboxService } from '../services/sandbox.service';
import { CertificateService } from '../services/certificate.service';
import { ApiError } from '../middleware/error.middleware';

export const runCodeSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code cannot be empty'),
    stdin: z.string().optional().default('')
  })
});

export const submitExerciseSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'Lesson ID is required'),
    code: z.string().min(1, 'Code cannot be empty')
  })
});

export class ExecutionController {
  /**
   * Run arbitrary Python code in the sandbox
   */
  public static async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, stdin } = req.body;
      const result = await SandboxService.executePython(code, stdin);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit exercise solution, evaluate against unit test cases, and update progress
   */
  public static async submitExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId, code } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new ApiError(401, 'Unauthorized. Please login to submit exercises.');
      }

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          exercise: true,
          module: {
            include: {
              course: {
                include: {
                  modules: {
                    include: {
                      lessons: {
                        select: { id: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        throw new ApiError(404, 'Lesson not found');
      }

      if (!lesson.exercise) {
        throw new ApiError(400, 'This lesson does not have an interactive coding exercise.');
      }

      const testCases = JSON.parse(lesson.exercise.testCasesJson || '[]');
      const evaluation = await SandboxService.evaluateExercise(code, testCases);

      let certificate = null;
      let courseCompleted = false;

      if (evaluation.allPassed) {
        // Save user progress
        await prisma.userProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId }
          },
          update: {
            completed: true,
            codeSubmission: code,
            updatedAt: new Date()
          },
          create: {
            userId,
            lessonId,
            completed: true,
            codeSubmission: code
          }
        });

        // Check if all lessons in the course are completed
        const course = lesson.module.course;
        const allCourseLessonIds: string[] = [];
        course.modules.forEach(m => m.lessons.forEach(l => allCourseLessonIds.push(l.id)));

        const completedCount = await prisma.userProgress.count({
          where: {
            userId,
            lessonId: { in: allCourseLessonIds },
            completed: true
          }
        });

        if (completedCount === allCourseLessonIds.length) {
          courseCompleted = true;
          certificate = await CertificateService.issueCertificate(userId, course.id);
        }
      } else {
        // Save latest attempt code even if failed
        await prisma.userProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId }
          },
          update: {
            codeSubmission: code,
            updatedAt: new Date()
          },
          create: {
            userId,
            lessonId,
            completed: false,
            codeSubmission: code
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          evaluation,
          courseCompleted,
          certificate
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
