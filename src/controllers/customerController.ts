import { Request, Response } from 'express';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

export const homepage = async (req: any, res: any) => {
  const messages = req.flash('info');
  const locals = {
    title: 'NodeJs',
    description: 'Free NodeJs User Management System',
  };
  const perPage = 10;
  const page = req.query.page || 1;

  try {
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
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

export const addCustomer = (req: any, res: any) => {
  const locals = {
    title: 'Add New Customer',
    description: 'Free NodeJs User Management System',
  };
  res.render('customer/add', locals);
};

export const postCustomer = async (req: Request, res: Response) => {
  console.log(req.body);
  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    email: req.body.email,
    tel: req.body.tel,
  });

  try {
    await Customer.create(newCustomer);
    req.flash('info', 'Customer added successfully');

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};
export const viewCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
};
