import {
  createCustomerSchema,
  getCustomerSchema,
} from '../schemas/customerSchema';

describe('customer schemas', () => {
  it('accepts a valid create customer payload', () => {
    const parsed = createCustomerSchema.parse({
      body: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        tel: '+1234567890',
        email: 'ada@example.com',
        details: 'Mathematician',
      },
    });

    expect(parsed.body.firstName).toBe('Ada');
  });

  it('rejects an invalid create customer payload', () => {
    expect(() =>
      createCustomerSchema.parse({
        body: {
          firstName: '',
          lastName: 'Lovelace',
          tel: '123',
          email: 'not-an-email',
        },
      }),
    ).toThrow();
  });

  it('accepts a valid MongoDB id', () => {
    const parsed = getCustomerSchema.parse({
      params: { id: '507f1f77bcf86cd799439011' },
    });

    expect(parsed.params.id).toBe('507f1f77bcf86cd799439011');
  });

  it('rejects an invalid MongoDB id', () => {
    expect(() =>
      getCustomerSchema.parse({
        params: { id: 'invalid-id' },
      }),
    ).toThrow();
  });
});
