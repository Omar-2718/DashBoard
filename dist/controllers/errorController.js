"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const zod_1 = require("zod");
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        isOperational: err.isOperational,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).render('error', {
            title: 'Error',
            message: err.message,
        });
    }
    else {
        console.error('ERROR 💥', err);
        res.status(err.statusCode).render('error', {
            title: 'Error',
            message: 'Something went wrong!',
        });
    }
};
const handleCastErrorDB = (err) => {
    console.log('Handling CastError:');
    const message = `invalid ${err.path}: ${err.value}`;
    return new AppError_1.default(message, 400);
};
const handelDuplicateFieldsDB = (err) => {
    const message = `duplicate field value: ${JSON.stringify(err.keyValue)}. please use another value!`;
    return new AppError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `invalid input data ${errors.join('. ')}`;
    return new AppError_1.default(message, 400);
};
const handelZodError = (err) => {
    const errors = err.issues.map((el) => `${el.message}`);
    return new AppError_1.default(`${errors.join('\n')}`, 400);
};
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'dev') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'prod') {
        if (err.name === 'CastError')
            err = handleCastErrorDB(err);
        // if (err.code === 11000) err = handelDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            err = handleValidationErrorDB(err);
        if (err instanceof zod_1.ZodError)
            err = handelZodError(err);
        console.log('whatever', typeof err);
        sendErrorProd(err, res);
    }
};
