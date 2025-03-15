import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import 'dotenv/config';
import './database/db.js';

import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

class App {

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    const options = {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(cors(options));
    this.app.use(cookieParser())
  }

  routes() {
    this.app.use('/api/v1/auth', authRoutes);
    this.app.use('/api/v1/tasks', tasksRoutes);
  }
}

export default new App().app;