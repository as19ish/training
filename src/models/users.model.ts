import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model()
export class Users extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_name: string;

  @property({
    type: 'string',
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middle_name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @belongsTo(() => Customer)
  customerId: number;

  @belongsTo(() => Role)
  roleId: number;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
