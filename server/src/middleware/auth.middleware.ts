import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminRequest extends Request {
  admin?: boolean;
}

export function authMiddleware(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not configured.');
    res.status(500).json({ success: false, message: 'Internal server configuration error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as any;
    
    if (decoded && decoded.admin === true) {
      req.admin = true;
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
