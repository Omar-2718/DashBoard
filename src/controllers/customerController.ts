/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NextFunction, Request, Response } from 'express';
import Customer from '../models/Customer';
import { CreateCustomerInput } from '../schemas/customerSchema';
import AppError from '../utils/AppError';

export const homepage = async (req: Request, res: Response) => {
  const messages = req.flash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System',
  };
  const perPage = 10;
  const page = Number(req.query.page) || 1;

  const customers = await Customer.aggregate([
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
  const customerCount = await Customer.countDocuments();
  res.render('index', {
    locals,
    messages,
    customers,
    current: page,
    pages: Math.ceil(customerCount / perPage),
  });
};

export const addCustomer = (req: Request, res: Response) => {
  const locals = {
    title: 'Add New Customer',
    description: 'Free NodeJs User Management System',
  };
  res.render('customer/add', locals);
};

export const postCustomer = async (
  req: Request<{}, {}, CreateCustomerInput['body']>,
  res: Response,
) => {
  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    email: req.body.email,
    tel: req.body.tel,
  });

  await Customer.create(newCustomer);
  req.flash('info', 'Customer added successfully');

  res.redirect('/');
};
export const viewCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const customer = await Customer.findOne({ _id: id });
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  const locals = {
    title: 'View Customer',
    description: 'Free NodeJs User Management System',
  };
  res.render('customer/view', { locals, customer });
};

export const editCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const locals = {
    title: 'Edit Customer',
    description: 'Free NodeJs User Management System',
  };
  const customer = await Customer.findOne({ _id: id });
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  res.render('customer/edit', { locals, customer });
};
export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const customer = await Customer.findByIdAndUpdate(id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    email: req.body.email,
    tel: req.body.tel,
    updatedAt: new Date(),
  });
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  req.flash('info', 'Customer updated successfully');
  res.redirect('/');
};
export const deleteCustomer = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const id = req.params.id;
  await Customer.findByIdAndDelete(id);
  req.flash('info', 'Customer deleted successfully');
  res.redirect('/');
};

export const searchCustomer = async (req: Request, res: Response) => {
  const searchTerm = String(req.body.searchTerm ?? '');
  const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

  const customers = await Customer.find({
    $or: [
      { firstName: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      { lastName: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
    ],
  });
  const locals = {
    title: 'Search Results',
    description: 'Free NodeJs User Management System',
  };
  res.render('customer/search', { locals, customers });
};
export const about = (req: Request, res: Response) => {
  const locals = {
    title: 'About',
    description: 'Free NodeJs User Management System',
  };
  res.render('customer/about', { locals });
};
