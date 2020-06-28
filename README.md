<h1 align="center">Nestjs Logger</h1>

<p align="center">Log component for NestJs.</p>

## Features

- Nestjs log component encapsulated with Winston.
- Free and flexible to define context.

### Installation

**Yarn**
```bash
yarn add @jiaxinjiang/nest-logger
```

**NPM**
```bash
npm install @jiaxinjiang/nest-logger --save
```

### Getting Started

First, you need to define the log configuration file. You must rely on the `@jiaxinjiang/nest-config` module.

Directory structure:

```bash
├── env
│   ├── env
│   ├── env.dev
│   ├── env.prod
│   ├── env.test
├── src
│   ├── app.module.ts
│   ├── config
│       ├── logger.config.ts
```

Logger configuration file:

```ts
// logger.config.ts

import * as path from 'path';
import * as color from 'cli-color';
import { format, transports, LoggerOptions } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

const logDir = path.resolve(globalConfig.rootDir, '../logs');

export default {
  logDir,
  level: process.env.NEST_LOGGER_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf(info => {
      // @ts-ignore
      if (info.message instanceof Error) {
        info.message = info.message.stack;
      }
      let levelMessage = `[${info.level.toLocaleUpperCase()}]`;
      switch (info.level) {
        case 'warn':
          levelMessage = color.yellow(levelMessage);
          break;
        case 'error':
          levelMessage = color.red(levelMessage);
          break;
        default:
          levelMessage = color.blue(levelMessage);
          break;
      }
      const pidMessage = color.green(`[Nest] ${process.pid}`);
      const ctxMessage = color.yellow(`[${info.context || 'DefaultContext'}]`);
      return `${pidMessage}   - ${info.timestamp}  ${ctxMessage} ${levelMessage} ${info.message}`;
    }),
  ),
  transports: [
    new DailyRotateFile({
      dirname: logDir,
      filename: `application.%DATE%.log`,
      datePattern: 'YYYYMMDD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.Console(),
    new transports.File({
      dirname: logDir,
      filename: 'error.log',
      level: 'error',
    }),
  ],
} as LoggerOptions;

```

Let's register the log module in app.module.ts


```ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@jiaxinjiang/nest-logger';

@Module({
    imports: [
        LoggerModule.forRoot(),
    ],
})
export class AppModule {}
```

You can use @InjectLogger decorator to inject the logger instance;

```ts
import { InjectLogger, LoggerProvider } from '@jiaxinjiang/nest-logger';

@Injectable()
class SomeService {
    constructor(
      @InjectLogger(SomeService) private readonly logger: LoggerProvider
    ) {}

    test() {
      this.logger.log('hello world!')
    }
}
```