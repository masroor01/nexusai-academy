import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { ApiError } from './error.middleware';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Check HttpOnly cookie first, then fallback to Authorization header
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication token missing or invalid. Please log in.'));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Session expired or invalid token. Please log in again.'));
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized access'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden. Requires one of roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
};
