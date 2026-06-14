import type { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { validateResources } from '../middlewares/validateResources';

const createResponse = () => ({}) as Response;

describe('validateResources', () => {
  it('writes parsed body, params, and query back to the request object', () => {
    const schema = z.object({
      body: z.object({ firstName: z.string() }),
      params: z.object({ id: z.string() }),
      query: z.object({ page: z.string() }),
    });

    const req = {
      body: { firstName: 'Ada', extra: 'ignored' },
      params: { id: '123' },
      query: { page: '2' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    validateResources(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ firstName: 'Ada' });
    expect(req.params).toEqual({ id: '123' });
    expect(req.query).toEqual({ page: '2' });
  });

  it('forwards schema errors to next', () => {
    const schema = z.object({
      body: z.object({ firstName: z.string() }),
    });

    const req = {
      body: {},
      params: {},
      query: {},
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    validateResources(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });
});
