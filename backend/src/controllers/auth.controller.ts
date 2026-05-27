import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { User } from '../models/User';
import { signToken, AuthenticatedRequest } from '../middleware/auth';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const hash = bcrypt.hashSync(password, 10);
    const id = 'u_' + Math.random().toString(36).substr(2, 9);

    const newUser = await User.create({
      id,
      name: validator.escape(name.trim()),
      email: email.toLowerCase().trim(),
      role: 'user',
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    });

    const userJson = newUser.toJSON() as any;
    const token = signToken(userJson);
    res.cookie('cortado_token', token, cookieOptions());
    res.status(201).json({ user: userJson });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const userJson = user.toJSON() as any;
    const token = signToken(userJson);
    res.cookie('cortado_token', token, cookieOptions());
    res.json({ user: userJson });
  } catch {
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('cortado_token');
  res.json({ message: 'Logged out successfully.' });
}

export function me(req: AuthenticatedRequest, res: Response): void {
  res.json({ user: req.user || null });
}
