import { Router } from 'express';
import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/data-source'; import { Admin } from '../entities/Admin';
export const authRoutes = Router();
authRoutes.post('/setup-admin', async (_req, res, next) => { try {
 const repo = AppDataSource.getRepository(Admin); if (await repo.count()) return res.status(409).json({ message: 'Admin already exists' });
 const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
 if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) return res.status(400).json({ message: 'Configure ADMIN_EMAIL and a 12+ character ADMIN_PASSWORD in .env' });
 await repo.save(repo.create({ name: ADMIN_NAME || 'Admin', email: ADMIN_EMAIL, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'super_admin' }));
 res.status(201).json({ message: 'Admin created. Disable this endpoint before deployment.' });
 } catch(e) { next(e); } });
authRoutes.post('/login', async (req, res, next) => { try {
 const { email, password } = req.body || {}; if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ message: 'Email and password required' });
 const repo = AppDataSource.getRepository(Admin); const admin = await repo.createQueryBuilder('a').addSelect('a.passwordHash').where('LOWER(a.email)=LOWER(:email)', { email }).getOne();
 if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
 const token = jwt.sign({ role: admin.role }, process.env.JWT_SECRET || '', { subject: admin.id, expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'] });
 res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
 } catch(e) { next(e); } });
