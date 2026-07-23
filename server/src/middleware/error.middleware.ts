import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Server Error]', err.stack || err.message || err);

  const isProd = process.env.NODE_ENV === 'production';
  const status = err.status || 500;

  let message = 'Internal Server Error';
  if (status < 500 || !isProd) {
    message = err.message || 'Internal Server Error';
  }

  res.status(status).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}
