import { LoggerOptions, createLogger } from 'winston';
import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@jiaxinjiang/nest-config';
import { LoggerProvider } from './logger.provider';
import { WINSTON_LOGGER } from './logger.constants';
import { createProvidersForDecorated } from './logger.decorator';

@Global()
@Module({})
export class LoggerModule {
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
}
