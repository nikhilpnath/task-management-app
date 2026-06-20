import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { createError } from '../utils/errors';

interface DecodedToken {
  id: string;
  name: string;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(createError('Authorization token required. Access denied.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
    
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  } catch (error) {
    return next(createError('Invalid or expired authorization token. Access denied.', 401));
  }
};

export default authMiddleware;
