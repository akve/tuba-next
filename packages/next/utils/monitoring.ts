import { Integrations } from '@sentry/tracing';

export type LogType = 'message' | 'exception' | 'event';

export const sentryLog = (logType: LogType, log: Error | string) => {
console.log(logType, log);
};

export const sentryInit = () => {
};

export const sentryInitSSR = () => {
};
export const sentrySSRLogException = (e: Error) => {
};
