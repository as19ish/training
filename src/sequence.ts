import {inject} from '@loopback/core';
import {FindRoute, HttpErrors, InvokeMethod, InvokeMiddleware, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizationBindings, AuthorizeErrorKeys, AuthorizeFn} from 'loopback4-authorization';
import {AuthUser} from './modules/auth/models/auth-user.model';
import {ILogger, LOG_LEVEL} from './types';

export class MySequence implements SequenceHandler {

  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthUser>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
    @inject('logger') private logger: ILogger,
  ) {}

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    const {request, response} = context;
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
      const finished = await this.invokeMiddleware(context);
      if (finished) {
        return;
      }
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      // await this.authenticateRequestClient(request);
      const authUser: AuthUser = await this.authenticateRequest(
        request,
        response,
      );
      console.log(authUser)
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser?.permissions,
        request,
      );
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.logger.log(LOG_LEVEL.INFO,
        `Request ${request.method} ${request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      );
      this.reject(context, err);
    } finally {
      this.logger.log(LOG_LEVEL.INFO,
        `Request ${request.method} ${request.url} Completed in ${Date.now() - requestTime
        }ms`,
      );
    }
  }
}
