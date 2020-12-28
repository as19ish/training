import {TransformableInfo} from 'logform';
import {createLogger, format, transports} from 'winston';
import {ILogger, LOG_LEVEL} from '../types';

interface LogEntry extends TransformableInfo {
  level: string;
  message: string;
  timestamp?: Date;
}

export class WinstonLogger implements ILogger {
  constructor() {
    const logFormat = format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(
        (log: LogEntry) => `[${log.timestamp}] ${log.level} :: ${log.message}`,
      ),
    );

    this.logger = createLogger({
      transports: [new transports.Console()],
      format: logFormat,
      level: process.env.LOG_LEVEL,
    });
  }
  private logger;

  log(level: number, message: string): void {
    switch (level) {
      case LOG_LEVEL.INFO:
        this.logger.info(message);
        break;
      case LOG_LEVEL.WARN:
        this.logger.warn(message);
        break;
      case LOG_LEVEL.ERROR:
        this.logger.error(message);
        break;
      case LOG_LEVEL.DEBUG:
        this.logger.debug(message);
        break;
    }
  }

}
