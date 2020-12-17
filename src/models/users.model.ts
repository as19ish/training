import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Role} from './role.model';

@model({
  settings: {
    foreignKeys: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fk_user_role: {
        name: 'fk_user_role',
        entity: 'Role',
        entityKey: 'id',
        foreignKey: 'role_id',
      }
    },
  }
})
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


  @belongsTo(() => Role, {keyTo: 'id', name: 'user_role'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  role_id: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
