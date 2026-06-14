import type { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';
import AppError from '../utils/AppError';
import errorController from '../controllers/errorController';

const createResponse = () => {
  const res = {} as Response & {
    status: jest.Mock;
    json: jest.Mock;
    render: jest.Mock;
  };

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);

  return res;
};

describe('errorController', () => {
  const req = {} as Request;
  const next = jest.fn() as NextFunction;

  afterEach(() => {
    delete process.env.NODE_ENV;
    jest.clearAllMocks();
  });

  it('returns JSON in dev mode', () => {
    process.env.NODE_ENV = 'dev';
    const res = createResponse();

    errorController(new AppError('boom', 404), req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'boom', status: 'fail' }),
    );
  });

  it('renders a friendly error page in prod mode for AppError', () => {
    process.env.NODE_ENV = 'prod';
    const res = createResponse();

    errorController(new AppError('boom', 404), req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.render).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ message: 'boom' }),
    );
  });

  it('converts Zod errors into user-facing messages', () => {
    process.env.NODE_ENV = 'prod';
    const res = createResponse();

    let zodError: ZodError;
    try {
      z.object({ name: z.string().min(1, 'Name is required') }).parse({
        name: '',
      });
      throw new Error('Expected validation failure');
    } catch (error) {
      zodError = error as ZodError;
    }

    errorController(zodError!, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ message: 'Name is required' }),
    );
  });
});
