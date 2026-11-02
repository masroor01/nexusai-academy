import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';

export class AnalyticsController {
  public static async getStudentAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      // 1. Fetch total courses & user progresses
      const courses = await prisma.course.findMany({
        include: {
          modules: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      });

      const userProgresses = await prisma.userProgress.findMany({
        where: { userId },
        include: {
          lesson: {
            include: {
              module: {
                include: { course: true }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      const certificates = await prisma.certificate.findMany({
        where: { userId }
      });

      // 2. Compute completed counts and proficiency per level
      let totalLessonsInPlatform = 0;
      const levelTotals: Record<string, { total: number; completed: number }> = {
        Beginner: { total: 0, completed: 0 },
        Intermediate: { total: 0, completed: 0 },
        Advanced: { total: 0, completed: 0 }
      };

      courses.forEach(c => {
        const lvl = c.level || 'Beginner';
        if (!levelTotals[lvl]) {
          levelTotals[lvl] = { total: 0, completed: 0 };
        }

        c.modules.forEach(m => {
          totalLessonsInPlatform += m.lessons.length;
          levelTotals[lvl].total += m.lessons.length;
        });
      });

      const completedLessons = userProgresses.filter(p => p.completed);
      completedLessons.forEach(p => {
        const lvl = p.lesson.module.course.level || 'Beginner';
        if (levelTotals[lvl]) {
          levelTotals[lvl].completed++;
        }
      });

      // 3. Compute Streak (consecutive days of activity)
      const activityDates = new Set(
        userProgresses.map(p => new Date(p.updatedAt).toISOString().split('T')[0])
      );

      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 60; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (activityDates.has(dateStr)) {
          currentStreak++;
        } else if (i === 0) {
          // If no activity today yet, check yesterday
          continue;
        } else {
          break;
        }
      }

      // If today had no activity, ensure yesterday starts the streak count
      if (currentStreak === 0 && activityDates.size > 0) {
        currentStreak = 1; // Minimum active indicator
      }

      // 4. Time spent estimation: ~20 mins per completed lesson + 10 mins per code attempt
      const estimatedMinutes = (completedLessons.length * 25) + (userProgresses.length * 5);
      const estimatedHours = (estimatedMinutes / 60).toFixed(1);

      // 5. Proficiency scores (0-100%)
      const proficiency = Object.keys(levelTotals).map(lvl => {
        const item = levelTotals[lvl];
        const score = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
        return {
          level: lvl,
          label: lvl === 'Beginner' ? 'Python Fundamentals & Data Wrangling' :
                 lvl === 'Intermediate' ? 'Scikit-Learn & Machine Learning' :
                 'Deep Learning & Neural Architectures',
          score,
          completed: item.completed,
          total: item.total
        };
      });

      const totalCompletionPercentage = totalLessonsInPlatform > 0
        ? Math.round((completedLessons.length / totalLessonsInPlatform) * 100)
        : 0;

      // 6. Recent activity timeline
      const recentActivity = userProgresses.slice(0, 5).map(p => ({
        lessonId: p.lessonId,
        lessonTitle: p.lesson.title,
        courseTitle: p.lesson.module.course.title,
        completed: p.completed,
        updatedAt: p.updatedAt
      }));

      return res.status(200).json({
        success: true,
        data: {
          streak: currentStreak,
          totalCourses: courses.length,
          completedCourses: certificates.length,
          completedLessons: completedLessons.length,
          totalLessons: totalLessonsInPlatform,
          totalCompletionPercentage,
          hoursSpent: parseFloat(estimatedHours),
          proficiency,
          recentActivity
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
