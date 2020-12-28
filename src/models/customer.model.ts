import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Users} from './users.model';

@model({
  settings: {
    foreignKeys: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fk_customer_user: {
        name: 'fk_customer_users',
        entity: 'Users',
        entityKey: 'id',
        foreignKey: 'user_id',
      }
    },
  }
})
export class Customer extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  website: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @belongsTo(() => Users, {name: 'user', keyTo: 'id'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_id: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
