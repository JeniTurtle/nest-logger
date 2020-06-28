import { format } from 'util';
import { Inject, LoggerService, Injectable, Scope } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_LOGGER } from './logger.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerProvider implements LoggerService {
  protected context: string;

  constructor(@Inject(WINSTON_LOGGER) private readonly logger: Logger) {}

  setContext(value: string) {
    this.context = value;
    return this;
  }

  public info(message: any, ...optionalParams: any[]) {
    return this.logger.info(format(message, ...optionalParams), {
      context: this.context || optionalParams[0],
    });
  }

  public log(message: any, ...optionalParams: any[]) {
    return this.logger.info(format(message, ...optionalParams), {
      context: this.context || optionalParams[0],
    });
  }

  public error(message: any, trace?: string, ...optionalParams: any[]): any {
    return this.logger.error(format(message, ...optionalParams), {
      trace,
      context: this.context || optionalParams[0],
    });
  }

  public warn(message: any, ...optionalParams: any[]): any {
    return this.logger.warn(format(message, ...optionalParams), {
      context: this.context || optionalParams[0],
    });
  }

  public debug?(message: any, ...optionalParams: any[]): any {
    return this.logger.debug(format(message, ...optionalParams), {
      context: this.context || optionalParams[0],
    });
  }

  public verbose?(message: any, ...optionalParams: any[]): any {
    return this.logger.verbose(format(message, ...optionalParams), {
      context: this.context || optionalParams[0],
    });
  }
}
