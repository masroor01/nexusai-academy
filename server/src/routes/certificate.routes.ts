import { Router } from 'express';
import { CertificateController } from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public verification route for /verify/:certificateId
router.get('/verify/:certificateId', CertificateController.verifyCertificate);

// Protected student routes
router.post('/generate', authenticate, CertificateController.generateCertificate);
router.get('/my', authenticate, CertificateController.getMyCertificates);

export default router;
