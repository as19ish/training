import {bind, BindingScope, Provider} from '@loopback/core';
import {ILogger} from '../types';
import {WinstonLogger} from '../winston/winstonLogger';

@bind({scope: BindingScope.SINGLETON})
export class LoggerProvider implements Provider<ILogger> {
  constructor() {
    this.logger = new WinstonLogger();

  }

  logger: ILogger;

  value() {
    return this.logger;
  }
}
