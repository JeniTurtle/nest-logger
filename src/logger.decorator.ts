import * as lodash from 'lodash';
import { Inject, Provider } from '@nestjs/common';
import { LoggerProvider } from './logger.provider';

const decoratedTokenPrefix = 'Logger:';
const decoratedLoggers = new Set<string>();

export function InjectLogger(context: string | Function) {
  const isString = (value): value is string => lodash.isString(value);
  if (!isString(context)) {
    context = context.name || '';
  }
  decoratedLoggers.add(context);
  return Inject(`${decoratedTokenPrefix}${context}`);
}

function createDecoratedLoggerProvider(
  context: string,
): Provider<LoggerProvider> {
  return {
    provide: `${decoratedTokenPrefix}${context}`,
    useFactory: (logger: LoggerProvider) => {
      logger.setContext(context);
      return logger;
    },
    inject: [LoggerProvider],
  };
}

export function createProvidersForDecorated(): Array<Provider<LoggerProvider>> {
  return [...decoratedLoggers.values()].map(context =>
    createDecoratedLoggerProvider(context),
  );
}
