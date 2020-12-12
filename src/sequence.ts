import {DefaultSequence, RequestContext} from '@loopback/rest';

export class MySequence extends DefaultSequence {
  log(msg: string) {
    console.log(msg);
  }
  async handle(context: RequestContext) {
    const requestTime = Date.now();
    const {request} = context;
    try {
      this.log(
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
      this.log(
        `Request ${request.method} ${request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      );
    } finally {
      this.log(
        `Request ${request.method} ${request.url
        } Completed in ${Date.now() - requestTime}ms`,
      );
    }
  }
}
