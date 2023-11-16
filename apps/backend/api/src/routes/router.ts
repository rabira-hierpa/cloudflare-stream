import express from 'express';
import devRouter from './DEV.routes';
import authRouter from './auth.routes';
import errorsRouter from './errors.routes';
import userRouter from './user.routes';

export default function initRouter(app: express.Application) {
  app.use('/', authRouter);
  app.use('/', userRouter);
  app.use('/', errorsRouter);
  if (process.env.NODE_ENV === 'development') {
    app.use('/', devRouter);
  }
}
