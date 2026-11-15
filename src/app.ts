// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import { routes } from './routes';
// export const app = express();
// app.use(helmet());
// // Allowed origins come from CLIENT_URL (comma separated). In development, any local
// // address (localhost, 127.0.0.1, or a LAN IP on any port) is also allowed.
// const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(o => o.trim().replace(/\/$/, ''));
// const isLocalDevOrigin = (origin: string) => process.env.NODE_ENV !== 'production' &&
//   /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
// app.use(cors({
//   origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)),
//   credentials: true
// }));
// app.use(express.json({ limit: '2mb' }));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000 }));
// // Stricter limit on login attempts and public form submissions
// const strictLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
// app.use((process.env.API_PREFIX || "/api/v1") + "/auth", strictLimit);
// app.post((process.env.API_PREFIX || "/api/v1") + "/enquiries", strictLimit);
// app.use(process.env.API_PREFIX || '/api/v1', routes);
// app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
// app.use((err: any, _req: any, res: any, _next: any) => { console.error(err); res.status(err.status || 500).json({ message: err.status ? err.message : 'Internal server error' }); });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { routes } from './routes';

export const app = express();

app.use(helmet());

// Allow all origins (*) while supporting credentials
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000 }));

// Stricter limit on login attempts and public form submissions
const strictLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
app.use((process.env.API_PREFIX || "/api/v1") + "/auth", strictLimit);
app.post((process.env.API_PREFIX || "/api/v1") + "/enquiries", strictLimit);

app.use(process.env.API_PREFIX || '/api/v1', routes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Internal server error' });
});
