import express, { Request, Response, NextFunction } from 'express';
import logger from '@foodbudget/logger';
import cookieParser from 'cookie-parser';
import { AppError, ErrorHandler } from '@foodbudget/errors';
import { PerformanceObserver } from 'perf_hooks';
import colors from 'colors/safe';
import passport from 'passport';
import { server } from './apolloServer';
import { config } from './config';
import { serviceManager } from './serviceManager';
import { authRoutes, socialTokenStrategyHandler } from './auth';

const pageNotFoundHandler = () => {
  throw new AppError({ message: 'Page not found', isOperational: true, httpStatus: 404 });
};

const errorHandler = async (
  // eslint-disable-next-line consistent-return
  err: unknown, _req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  if (err instanceof AppError && ErrorHandler.isOperational(err)) {
    return res.status(err.httpStatus || 500).json({ error: err.message });
  }

  next(err);
};

const obs = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  logger.info(colors.green(`Time for '${entry.name}': ${entry.duration}ms`));
});

obs.observe({ entryTypes: ['measure'], buffered: false });

const app = express();

app.use(cookieParser());
app.disable('x-powered-by');

server.applyMiddleware({ app, path: config.api.prefix });

app.get('/healthcheck', (_req, res) => {
  res.status(200).send('Application is working perfectly!');
});

app.use(socialTokenStrategyHandler({ googleConfig: config.google, facebookConfig: config.facebook }));
app.use(passport.initialize());
app.use('/v1/auth', authRoutes({
  tokenServices: serviceManager.tokenServices, authServices: serviceManager.authServices, env: config.env }));

app.use(pageNotFoundHandler);
app.use(errorHandler);

app.listen(config.api.port, () => logger.info(colors.cyan(`App is now running at port ${config.api.port}`)));
