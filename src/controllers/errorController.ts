import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import { ZodError } from 'zod';

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    isOperational: err.isOperational,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: 'Error',
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(err.statusCode).render('error', {
      title: 'Error',
      message: 'Something went wrong!',
    });
  }
};
const handleCastErrorDB = (err: any) => {
  console.log('Handling CastError:');
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handelDuplicateFieldsDB = (err: any) => {
  const message = `duplicate field value: ${JSON.stringify(err.keyValue)}. please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handelZodError = (err: ZodError) => {
  const errors = err.issues.map((el) => `${el.message}`);
  return new AppError(`${errors.join('\n')}`, 400);
};
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'dev') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'prod') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    // if (err.code === 11000) err = handelDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err instanceof ZodError) err = handelZodError(err);
    console.log('whatever', typeof err);
    sendErrorProd(err, res);
  }
};
