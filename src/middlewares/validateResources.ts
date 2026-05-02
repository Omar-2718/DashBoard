import { NextFunction, Request, Response } from 'express';

export const validateResources = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validating resources with schema:', schema);
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
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
