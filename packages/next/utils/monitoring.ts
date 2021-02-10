import * as Sentry from '@sentry/react';
import * as SentryInner from '@sentry/node';
import { Integrations } from '@sentry/tracing';

export type LogType = 'message' | 'exception' | 'event';

export const sentryLog = (logType: LogType, log: Error | string) => {
  if (logType === 'exception') {
    Sentry.captureException(log);
  }
  if (logType === 'message') {
    Sentry.captureMessage(log.toString());
  }
};

export const sentryInit = () => {
  Sentry.init({
    dsn: 'https://2cce53d64a3a4175bd7d285a12887cde@o451025.ingest.sentry.io/5506868',
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
};

export const sentryInitSSR = () => {
  SentryInner.init({
    dsn: 'https://2cce53d64a3a4175bd7d285a12887cde@o451025.ingest.sentry.io/5506868',

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
};
export const sentrySSRLogException = (e: Error) => {
  SentryInner.captureException(e);
};
