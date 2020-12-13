import {inject} from '@loopback/core';
import {DefaultSequence, FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceActions} from '@loopback/rest';
import {ILogger, LOG_LEVEL} from './types';

export class MySequence extends DefaultSequence {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject('logger') private logger: ILogger,
  ) {
    super(findRoute, parseParams, invoke, send, reject);
  }

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    const {request} = context;
    console.log('jjjj');
    try {
      this.logger.log(LOG_LEVEL.INFO,
        `Request ${request.method} ${request.url
        } started at ${requestTime.toString()}.
          Request Details
          Referer = ${request.headers.referer}
          User-Agent = ${request.headers['user-agent']}
          Remote Address = ${request.connection.remoteAddress}
          Remote Address (Proxy) = ${request.headers['x-forwarded-for']}`,
      );
      await super.handle(context);
    } catch (err) {
      this.logger.log(LOG_LEVEL.INFO,
        `Request ${request.method} ${request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      );
    } finally {
      this.logger.log(LOG_LEVEL.INFO,
        `Request ${request.method} ${request.url} Completed in ${Date.now() - requestTime
        }ms`,
      );
    }
  }
}
