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
  try {
    const customer = await Customer.findOne({ _id: id });
    const locals = {
      title: 'View Customer',
      description: 'Free NodeJs User Management System',
    };
    res.render('customer/view', { locals, customer });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

export const editCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const locals = {
      title: 'Edit Customer',
      description: 'Free NodeJs User Management System',
    };
    const customer = await Customer.findOne({ _id: id });
    res.render('customer/edit', { locals, customer });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};
export const updateCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Customer.findByIdAndUpdate(id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      details: req.body.details,
      email: req.body.email,
      tel: req.body.tel,
      updatedAt: new Date(),
    });
    req.flash('info', 'Customer updated successfully');
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Customer.findByIdAndDelete(id);
    req.flash('info', 'Customer deleted successfully');
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

export const searchCustomer = async (req: Request, res: Response) => {
  const searchTerm = req.body.searchTerm;
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
