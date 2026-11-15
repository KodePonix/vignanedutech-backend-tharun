import { Router } from 'express'; import { authRoutes } from './auth'; import { publicRoutes } from './public'; import { adminRoutes } from './admin';
export const routes = Router(); routes.use('/auth', authRoutes); routes.use('/', publicRoutes); routes.use('/admin', adminRoutes);
