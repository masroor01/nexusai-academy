import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { ApiError } from '../middleware/error.middleware';

export class CourseController {
  public static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      const courses = await prisma.course.findMany({
        include: {
          modules: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lessons: {
                orderBy: { orderIndex: 'asc' },
                select: { id: true, title: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      // Calculate progress if user is authenticated
      const enrichedCourses = await Promise.all(
        courses.map(async (course) => {
          let totalLessons = 0;
          const lessonIds: string[] = [];

          course.modules.forEach(m => {
            totalLessons += m.lessons.length;
            m.lessons.forEach(l => lessonIds.push(l.id));
          });

          let completedCount = 0;
          if (userId && lessonIds.length > 0) {
            completedCount = await prisma.userProgress.count({
              where: {
                userId,
                lessonId: { in: lessonIds },
                completed: true
              }
            });
          }

          const completionPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

          return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            level: course.level,
            thumbnail: course.thumbnail,
            moduleCount: course.modules.length,
            lessonCount: totalLessons,
            completedLessons: completedCount,
            progressPercentage: completionPercent
          };
        })
      );

      return res.status(200).json({
        success: true,
        data: { courses: enrichedCourses }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const userId = req.user?.userId;

      const course = await prisma.course.findUnique({
        where: { slug },
        include: {
          modules: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lessons: {
                orderBy: { orderIndex: 'asc' },
                include: {
                  exercise: {
                    select: { id: true, prompt: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!course) {
        throw new ApiError(404, 'Course not found');
      }

      // Fetch completed lesson IDs for this user
      let completedLessonIds = new Set<string>();
      if (userId) {
        const progresses = await prisma.userProgress.findMany({
          where: {
            userId,
            completed: true
          },
          select: { lessonId: true }
        });
        progresses.forEach(p => completedLessonIds.add(p.lessonId));
      }

      let totalLessons = 0;
      let completedCount = 0;

      const formattedModules = course.modules.map(mod => {
        const formattedLessons = mod.lessons.map(l => {
          totalLessons++;
          const isCompleted = completedLessonIds.has(l.id);
          if (isCompleted) completedCount++;

          return {
            id: l.id,
            title: l.title,
            orderIndex: l.orderIndex,
            hasExercise: !!l.exercise,
            isCompleted
          };
        });

        return {
          id: mod.id,
          title: mod.title,
          orderIndex: mod.orderIndex,
          lessons: formattedLessons
        };
      });

      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return res.status(200).json({
        success: true,
        data: {
          course: {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            level: course.level,
            thumbnail: course.thumbnail,
            modules: formattedModules,
            totalLessons,
            completedLessons: completedCount,
            progressPercentage
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getLessonById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: {
          module: {
            include: {
              course: true
            }
          },
          exercise: true
        }
      });

      if (!lesson) {
        throw new ApiError(404, 'Lesson not found');
      }

      let userProgress = null;
      let userNote = null;
      let userBookmarks: any[] = [];

      if (userId) {
        userProgress = await prisma.userProgress.findUnique({
          where: {
            userId_lessonId: { userId, lessonId: id }
          }
        });

        userNote = await prisma.note.findUnique({
          where: {
            userId_lessonId: { userId, lessonId: id }
          }
        });

        userBookmarks = await prisma.bookmark.findMany({
          where: {
            userId,
            lessonId: id
          },
          orderBy: { timestamp: 'asc' }
        });
      }

      // Safe test cases parsing for frontend (hide expected outputs for hidden tests)
      let parsedExercise = null;
      if (lesson.exercise) {
        const rawCases = JSON.parse(lesson.exercise.testCasesJson || '[]');
        const safeCases = rawCases.map((tc: any) => ({
          name: tc.name,
          input: tc.input || '',
          expectedOutput: tc.hidden ? '[Hidden Test Case]' : tc.expectedOutput,
          hidden: !!tc.hidden
        }));

        parsedExercise = {
          id: lesson.exercise.id,
          prompt: lesson.exercise.prompt,
          starterCode: userProgress?.codeSubmission || lesson.exercise.starterCode,
          testCases: safeCases
        };
      }

      return res.status(200).json({
        success: true,
        data: {
          lesson: {
            id: lesson.id,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            contentMarkdown: lesson.contentMarkdown,
            orderIndex: lesson.orderIndex,
            module: {
              id: lesson.module.id,
              title: lesson.module.title,
              course: {
                id: lesson.module.course.id,
                title: lesson.module.course.title,
                slug: lesson.module.course.slug,
                level: lesson.module.course.level
              }
            },
            exercise: parsedExercise,
            isCompleted: !!userProgress?.completed,
            note: userNote?.content || '',
            bookmarks: userBookmarks
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
