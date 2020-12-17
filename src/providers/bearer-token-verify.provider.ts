import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {Users} from '../models';
import {UsersRepository} from '../repositories';


export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as Users;
      return user;
    };
  }
}
