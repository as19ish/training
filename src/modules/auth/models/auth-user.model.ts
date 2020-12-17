import {model, Model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';

@model()
export class AuthUser extends Model implements IAuthUser {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'array',
    itemType: 'string',
    description: `This property is supposed to be a array of strings
      and is a required field.
      This could be empty though.`,
  })
  permissions: string[];

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  constructor(data?: Partial<AuthUser>) {
    super(data);
  }
}
