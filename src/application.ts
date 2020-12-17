import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import path from 'path';
import {LoggerProvider} from './providers';
import {BearerTokenVerifyProvider} from './providers/bearer-token-verify.provider';
import {MySequence} from './sequence';
import {ILogger} from './types';

export {ApplicationConfig};

export class UserCrudApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.default',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest || {};
    options.rest.cors = {
      origin: process.env.ALLOWED_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400,
      credentials: true,
    };
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.bind(BindingKey.create<ILogger>('logger')).toProvider(LoggerProvider);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(BearerTokenVerifyProvider);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers', 'modules'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
