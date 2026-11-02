import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { CertificateService } from '../services/certificate.service';
import { ApiError } from '../middleware/error.middleware';

export class CertificateController {
  public static async generateCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      const userId = req.user!.userId;

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      });

      if (!course) {
        throw new ApiError(404, 'Course not found');
      }

      const allLessonIds: string[] = [];
      course.modules.forEach(m => m.lessons.forEach(l => allLessonIds.push(l.id)));

      const completedCount = await prisma.userProgress.count({
        where: {
          userId,
          lessonId: { in: allLessonIds },
          completed: true
        }
      });

      if (completedCount < allLessonIds.length) {
        throw new ApiError(400, `Course not yet completed. You have finished ${completedCount}/${allLessonIds.length} lessons.`);
      }

      const cert = await CertificateService.issueCertificate(userId, courseId);

      return res.status(200).json({
        success: true,
        message: 'Certificate generated successfully!',
        data: { certificate: cert }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const certs = await prisma.certificate.findMany({
        where: { userId },
        include: {
          course: true,
          user: true
        },
        orderBy: { issueDate: 'desc' }
      });

      const enriched = await Promise.all(
        certs.map(c => CertificateService.verifyCertificate(c.id))
      );

      return res.status(200).json({
        success: true,
        data: { certificates: enriched.filter(Boolean) }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async verifyCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { certificateId } = req.params;

      const cert = await CertificateService.verifyCertificate(certificateId);

      if (!cert) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found or invalid verification ID.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Certificate verified authentic.',
        data: { certificate: cert }
      });
    } catch (error) {
      next(error);
    }
  }
}
