import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {UsersRepository} from '.';
import {PgDataSource} from '../datasources';
import {Customer, CustomerRelations, Users} from '../models';


export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.customer_id,
  CustomerRelations
  > {

  public readonly user: BelongsToAccessor<
    Users,
    typeof Users.prototype.id
  >;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Customer, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );

    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
