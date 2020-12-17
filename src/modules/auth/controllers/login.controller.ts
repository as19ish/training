import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  post,
  requestBody
} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {authorize} from 'loopback4-authorization';
import {RoleRepository, UsersRepository} from '../../../repositories';
import {LoginRequest} from '../models/login-request.dto';

export class LoginController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository
  ) {}

  @authorize({permissions: ['*']})
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
    const role = await this.roleRepository.findOne({
      where: {
        id: user.role_id
      }
    });
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: role?.name,
        permissions: role?.permissions

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
