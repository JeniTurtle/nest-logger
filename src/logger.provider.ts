import { format } from 'util';
import {
  Inject,
  LoggerService as NestLoggerService,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_LOGGER, REQUEST_INFO } from './logger.constants';
import { RequestMetadata } from './logger.interface';
import { cls } from './logger.session';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerProvider implements NestLoggerService {
  protected context: string;

  private isTimestampEnabled: boolean = false;

  static instance: LoggerProvider;

  static logLevels = ['log', 'error', 'warn', 'debug', 'verbose'];

  constructor(@Inject(WINSTON_LOGGER) private readonly logger: Logger) {}

  get requestId() {
    const requestInfo: RequestMetadata = cls.get(REQUEST_INFO);
    if (requestInfo && requestInfo.requestId) {
      return requestInfo.requestId;
    }
    return null;
  }

  setContext(value: string) {
    this.context = value;
    return this;
  }

  requestContext(context?: string) {
    if (this.requestId) {
      return `${context || this.context}-${this.requestId}`;
    }
    return context || this.context;
  }

  public info(message: any, ...optionalParams: any[]) {
    return this.logger.info(format(message, ...optionalParams), {
      context: this.requestContext(optionalParams[0]),
    });
  }

  public log(message: any, ...optionalParams: any[]) {
    return this.logger.info(format(message, ...optionalParams), {
      context: this.requestContext(optionalParams[0]),
    });
  }

  public error(message: any, trace?: string, ...optionalParams: any[]): any {
    return this.logger.error(format(message, ...optionalParams), {
      trace,
      context: this.requestContext(optionalParams[0]),
    });
  }

  public warn(message: any, ...optionalParams: any[]): any {
    return this.logger.warn(format(message, ...optionalParams), {
      context: this.requestContext(optionalParams[0]),
    });
  }

  public debug?(message: any, ...optionalParams: any[]): any {
    return this.logger.debug(format(message, ...optionalParams), {
      context: this.requestContext(optionalParams[0]),
    });
  }

  public verbose?(message: any, ...optionalParams: any[]): any {
    return this.logger.verbose(format(message, ...optionalParams), {
      context: this.requestContext(optionalParams[0]),
    });
  }

  callFunction(name, message, context) {
    if (!this.isLogLevelEnabled(name)) {
      return;
    }
    const instance = this.getInstance();
    const func = instance && instance[name];
    func &&
      func.call(
        instance,
        message,
        context || this.context,
        this.isTimestampEnabled,
      );
  }

  getInstance() {
    const { instance } = LoggerProvider;
    return instance === this ? LoggerProvider : instance;
  }

  isLogLevelEnabled(level) {
    return LoggerProvider.logLevels.includes(level);
  }
}
