"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z
            .string()
            .nonempty('First name is required')
            .max(50, 'First name must be at most 50 characters'),
        lastName: zod_1.z
            .string()
            .nonempty('Last name is required')
            .max(50, 'Last name must be at most 50 characters'),
        tel: zod_1.z
            .string()
            .nonempty('Phone number is required')
            .regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number format')
            .max(15, 'Phone number must be at most 15 digits'),
        email: zod_1.z
            .string()
            .email('Invalid email address')
            .nonempty('Email is required')
            .max(100, 'Email must be at most 100 characters'),
        details: zod_1.z
            .string()
            .max(200, 'Customer details must be at most 200 characters')
            .optional(),
    })
        .strict(),
});
exports.getCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectID'),
    }),
});
