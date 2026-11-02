import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { TokenPayload } from '../middleware/auth.middleware';

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
      req.user = decoded;
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
};
