import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Customer, Users, UsersRelations, Role} from '../models';
import {CustomerRepository} from './customer.repository';
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
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Users, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor(
      'customer',
      customerRepositoryGetter,
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
