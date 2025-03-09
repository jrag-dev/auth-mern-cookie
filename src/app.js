import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
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
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/api/v1/auth', authRoutes);
    this.app.use('/api/v1/tasks', tasksRoutes);
  }
}

export default new App().app;