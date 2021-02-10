import * as SentryInner from '@sentry/node';
// import * as Tracing from '@sentry/tracing';
import { NextFunction, Request, Response } from 'express';
import config from '../lib/config';

export type LogType = 'message' | 'exception' | 'event';

export const Sentry = SentryInner;
export const sentryInit = () => {
  SentryInner.init({
    dsn: 'https://1f27aeeb0f224dbda2b4814f75eecac6@o451025.ingest.sentry.io/5578251',
    environment: config.environment,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
};

export const sentryRequestBreadcrumb = (req: Request, res: Response, next: NextFunction) => {
  console.log('RB', req.url);
  SentryInner.addBreadcrumb({
    type: 'request',
    message: req.url,
    data: req.body,
  });
  next();
};
export const sentryLog = (logType: LogType, log: Error | string) => {
  if (logType === 'exception') {
    // console.log(':(((');
    SentryInner.captureException(log);
  }
  if (logType === 'message') {
    SentryInner.captureMessage(log.toString());
  }
};
