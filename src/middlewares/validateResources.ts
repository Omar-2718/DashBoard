import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

type RequestPayload = {
  body?: Request['body'];
  params?: Request['params'];
  query?: Request['query'];
};

export const validateResources = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as RequestPayload;

      if (parsedData.body !== undefined) req.body = parsedData.body;
      if (parsedData.params !== undefined) req.params = parsedData.params;
      if (parsedData.query !== undefined) {
        Object.defineProperty(req, 'query', { value: parsedData.query });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
