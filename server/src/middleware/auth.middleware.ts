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

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error("[Auth] No token provided in header");
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret') as any;
    console.log("[Auth] Successfully decoded token:", decoded);

    // Ensure role or admin flag exists
    if (decoded.role !== 'ADMIN' && !decoded.isAdmin && !decoded.admin) {
      console.error("[Auth] User is not an admin:", decoded);
      res.status(403).json({ success: false, message: "Access denied: Admin role required" });
      return;
    }

    (req as any).user = decoded;
    req.admin = true;
    next();
  } catch (error: any) {
    console.error("[Auth Verification Error]:", error.message);
    res.status(401).json({ success: false, message: `Invalid token: ${error.message}` });
  }
}
