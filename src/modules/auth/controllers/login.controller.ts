import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  post,
  requestBody
} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {UsersRepository} from '../../../repositories';
import {LoginRequest} from '../models/login-request.dto';

export class LoginController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  @post('/login', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRequest),
        },
      },
    })
    loginRequest: LoginRequest,
  ): Promise<{accessToken: string}> {
    const user = await this.usersRepository.verifyPassword(
      loginRequest.username,
      loginRequest.password
    );
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        first_name: user.first_name
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h',
        issuer: process.env.JWT_ISSUER,
      },
    );

    return {
      accessToken
    };

  }

}
