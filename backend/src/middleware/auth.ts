import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { env } from '../config/env';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function signToken(user: UserPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.cortado_token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      res.clearCookie('cortado_token');
      return next();
    }
    req.user = user.toJSON() as UserPayload;
    next();
  } catch {
    res.clearCookie('cortado_token');
    next();
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Administrator privileges required.' });
    return;
  }
  next();
}
