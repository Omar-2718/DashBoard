import { z } from 'zod';

export const createCustomerSchema = z
  .object({
    body: z.object({
      firstName: z
        .string()
        .nonempty('First name is required')
        .max(50, 'First name must be at most 50 characters'),
      lastName: z
        .string()
        .nonempty('Last name is required')
        .max(50, 'Last name must be at most 50 characters'),
      tel: z
        .string()
        .nonempty('Phone number is required')
        .regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number format')
        .max(15, 'Phone number must be at most 15 digits'),
      email: z
        .string()
        .email('Invalid email address')
        .nonempty('Email is required')
        .max(100, 'Email must be at most 100 characters'),
      details: z
        .string()
        .max(200, 'Customer details must be at most 200 characters')
        .optional(),
    }),
  })
  .strict();
export const getCustomerSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectID'),
  }),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type GetCustomerInput = z.infer<typeof getCustomerSchema>;
