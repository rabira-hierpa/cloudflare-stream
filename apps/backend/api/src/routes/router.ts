import express from 'express';
import { API_VERSION } from '../main';
import devRouter from './DEV.routes';
import authRouter from './auth.routes';
import errorsRouter from './errors.routes';
import userRouter from './user.routes';

export default function initRouter(app: express.Application) {
  app.use(`${API_VERSION}/account/`, authRouter);
  app.use(`${API_VERSION}/user/`, userRouter);
  app.use(`${API_VERSION}/error/`, errorsRouter);
  if (process.env.NODE_ENV === 'development') {
    app.use(`${API_VERSION}/`, devRouter);
  }
}
