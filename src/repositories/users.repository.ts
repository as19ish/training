import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DataObject,
  DefaultCrudRepository,
  Options,
  repository
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcrypt';
import {AuthErrorKeys} from 'loopback4-authentication';
import {PgDataSource} from '../datasources';
import {Customer, Role, Users, UsersRelations} from '../models';
import {RoleRepository} from './role.repository';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
  > {
  public readonly customer: BelongsToAccessor<
    Customer,
    typeof Users.prototype.id
  >;

  public readonly role: BelongsToAccessor<Role, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Users, dataSource);

    this.role = this.createBelongsToAccessorFor(
      'user_role',
      roleRepositoryGetter,
    );

    this.registerInclusionResolver('user_role', this.role.inclusionResolver);
  }

  async create(entity: DataObject<Users>, options?: Options): Promise<Users> {

    entity.password = await bcrypt.hash(
      entity.password,
      10,
    );
    const user = await super.create(entity, options);
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<Users> {
    const user = await super.findOne({
      where: {username}
    });
    if (!user || !user.password) {
      throw new HttpErrors.Unauthorized("UserDoesNotExist");
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    return user;
  }
}
