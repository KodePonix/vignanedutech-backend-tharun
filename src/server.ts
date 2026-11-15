import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './database/data-source';
import { app } from './app';
const port = Number(process.env.PORT || 5000);
AppDataSource.initialize().then(() => app.listen(port, () => console.log(`API running on ${port}`))).catch(err => { console.error(err); process.exit(1); });
