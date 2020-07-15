import { LoggerOptions, createLogger } from 'winston';
import {
  Module,
  Global,
  DynamicModule,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigModule, ConfigService } from '@jiaxinjiang/nest-config';
import { LoggerProvider } from './logger.provider';
import { WINSTON_LOGGER } from './logger.constants';
import { createProvidersForDecorated } from './logger.decorator';
import { requestContextPlugin } from './logger.middleware';

@Global()
@Module({})
export class LoggerModule implements NestModule {
  static forRoot(): DynamicModule {
    const decorated = createProvidersForDecorated();

    return {
      imports: [ConfigModule],
      module: LoggerModule,
      providers: [
        {
          provide: WINSTON_LOGGER,
          useFactory: (configService: ConfigService) => {
            const winstonConfig: LoggerOptions = configService.get('logger');
            return createLogger(winstonConfig);
          },
          inject: [ConfigService],
        },
        LoggerProvider,
        ...decorated,
      ],
      exports: [WINSTON_LOGGER, LoggerProvider, ...decorated],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    // @ts-ignore
    const httpAdapter: FastifyAdapter = consumer.httpAdapter;
    if (!httpAdapter.constructor || httpAdapter.constructor.name !== 'FastifyAdapter') {
      return;
    }
    httpAdapter.register(requestContextPlugin);
  }
}


