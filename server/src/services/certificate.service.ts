import crypto from 'crypto';
import QRCode from 'qrcode';
import { prisma } from './prisma.service';

export interface CertificateMetadata {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseLevel: string;
  courseSlug: string;
  issueDate: string;
  verificationHash: string;
  qrCodeUrl: string;
  verificationUrl: string;
}

export class CertificateService {
  /**
   * Compute a secure SHA-256 verification hash
   */
  public static generateHash(userId: string, courseId: string, timestamp: number): string {
    const salt = 'NEXUSAI_ACADEMY_ACCREDITED_CERTIFICATE_SALT_2026';
    return crypto
      .createHash('sha256')
      .update(`${userId}:${courseId}:${timestamp}:${salt}`)
      .digest('hex');
  }

  /**
   * Issue or fetch an existing certificate for user and course
   */
  public static async issueCertificate(userId: string, courseId: string, baseUrl: string = 'http://localhost:5173'): Promise<CertificateMetadata> {
    // Check if certificate already exists
    let cert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        user: true,
        course: true
      }
    });

    if (!cert) {
      const now = new Date();
      const verificationHash = this.generateHash(userId, courseId, now.getTime());

      cert = await prisma.certificate.create({
        data: {
          userId,
          courseId,
          issueDate: now,
          verificationHash
        },
        include: {
          user: true,
          course: true
        }
      });
    }

    const verificationUrl = `${baseUrl}/verify/${cert.id}`;
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    return {
      id: cert.id,
      studentName: cert.user.name,
      studentEmail: cert.user.email,
      courseTitle: cert.course.title,
      courseLevel: cert.course.level,
      courseSlug: cert.course.slug,
      issueDate: cert.issueDate.toISOString(),
      verificationHash: cert.verificationHash,
      qrCodeUrl,
      verificationUrl
    };
  }

  /**
   * Verify certificate by ID
   */
  public static async verifyCertificate(certificateId: string, baseUrl: string = 'http://localhost:5173'): Promise<CertificateMetadata | null> {
    const cert = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: true,
        course: true
      }
    });

    if (!cert) return null;

    const verificationUrl = `${baseUrl}/verify/${cert.id}`;
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    return {
      id: cert.id,
      studentName: cert.user.name,
      studentEmail: cert.user.email,
      courseTitle: cert.course.title,
      courseLevel: cert.course.level,
      courseSlug: cert.course.slug,
      issueDate: cert.issueDate.toISOString(),
      verificationHash: cert.verificationHash,
      qrCodeUrl,
      verificationUrl
    };
  }
}
