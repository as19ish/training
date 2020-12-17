import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {Customer} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @post('/customers', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Customer)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id'>,
  ): Promise<Customer> {
    return this.customerRepository.create(customer);
  }

  @authenticate(STRATEGY.BEARER)
  @get('/customers/count', {
    responses: {
      '200': {
        description: 'Customer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Customer) where?: Where<Customer>): Promise<Count> {
    return this.customerRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @get('/customers', {
    responses: {
      '200': {
        description: 'Array of Customer model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Customer, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @patch('/customers', {
    responses: {
      '200': {
        description: 'Customer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.updateAll(customer, where);
  }

  @authenticate(STRATEGY.BEARER)
  @get('/customers/{id}', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Customer, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Customer, {exclude: 'where'})
    filter?: FilterExcludingWhere<Customer>,
  ): Promise<Customer> {
    return this.customerRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @patch('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    await this.customerRepository.updateById(id, customer);
  }

  @authenticate(STRATEGY.BEARER)
  @put('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customer PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customer: Customer,
  ): Promise<void> {
    await this.customerRepository.replaceById(id, customer);
  }

  @authenticate(STRATEGY.BEARER)
  @del('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customer DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.customerRepository.deleteById(id);
  }
}
