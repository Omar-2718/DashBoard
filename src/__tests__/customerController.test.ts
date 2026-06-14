import type { Request, Response } from 'express';
import AppError from '../utils/AppError';
import * as customerController from '../controllers/customerController';
import Customer from '../models/Customer';

jest.mock('../models/Customer', () => {
  const CustomerMock = jest.fn((data) => data) as jest.Mock & {
    aggregate: jest.Mock;
    countDocuments: jest.Mock;
    create: jest.Mock;
    findOne: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    find: jest.Mock;
  };

  CustomerMock.aggregate = jest.fn();
  CustomerMock.countDocuments = jest.fn();
  CustomerMock.create = jest.fn();
  CustomerMock.findOne = jest.fn();
  CustomerMock.findByIdAndUpdate = jest.fn();
  CustomerMock.findByIdAndDelete = jest.fn();
  CustomerMock.find = jest.fn();

  return {
    __esModule: true,
    default: CustomerMock,
  };
});

const mockedCustomer = Customer as unknown as {
  aggregate: jest.Mock;
  countDocuments: jest.Mock;
  create: jest.Mock;
  findOne: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
  find: jest.Mock;
};

const createResponse = () => {
  const res = {} as Response & { render: jest.Mock; redirect: jest.Mock };
  res.render = jest.fn();
  res.redirect = jest.fn();
  return res;
};

const createRequest = (overrides: Partial<Request> = {}) =>
  ({
    body: {},
    params: {},
    query: {},
    flash: jest.fn().mockReturnValue([]),
    ...overrides,
  }) as Request & { flash: jest.Mock };

describe('customerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the homepage', async () => {
    mockedCustomer.aggregate.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
      }),
    });
    mockedCustomer.countDocuments.mockResolvedValue(0);

    const req = createRequest({ query: { page: '1' } });
    const res = createResponse();

    await customerController.homepage(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'index',
      expect.objectContaining({ current: 1 }),
    );
  });

  it('shows the add form', () => {
    const req = createRequest();
    const res = createResponse();

    customerController.addCustomer(req, res);

    expect(res.render).toHaveBeenCalledWith('customer/add', {
      title: 'Add New Customer',
      description: 'Free NodeJs User Management System',
    });
  });

  it('creates a customer and redirects home', async () => {
    mockedCustomer.create.mockResolvedValue({});
    const req = createRequest({
      body: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        details: 'Analyst',
        email: 'ada@example.com',
        tel: '+1234567890',
      },
      flash: jest.fn(),
    });
    const res = createResponse();

    await customerController.postCustomer(req as never, res);

    expect(mockedCustomer.create).toHaveBeenCalled();
    expect(req.flash).toHaveBeenCalledWith(
      'info',
      'Customer added successfully',
    );
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('renders a customer when found', async () => {
    mockedCustomer.findOne.mockResolvedValue({ _id: 'abc', firstName: 'Ada' });
    const req = createRequest({ params: { id: 'abc' } });
    const res = createResponse();
    const next = jest.fn();

    await customerController.viewCustomer(req, res, next);

    expect(res.render).toHaveBeenCalledWith(
      'customer/view',
      expect.any(Object),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('passes an AppError when the customer is missing', async () => {
    mockedCustomer.findOne.mockResolvedValue(null);
    const req = createRequest({ params: { id: 'missing' } });
    const res = createResponse();
    const next = jest.fn();

    await customerController.viewCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.message).toBe('Customer not found');
    expect(error.statusCode).toBe(404);
  });

  it('searches customers by name', async () => {
    mockedCustomer.find.mockResolvedValue([{ _id: 'abc' }]);
    const req = createRequest({ body: { searchTerm: 'A!d@a' } });
    const res = createResponse();

    await customerController.searchCustomer(req, res);

    expect(mockedCustomer.find).toHaveBeenCalledWith({
      $or: [
        { firstName: { $regex: /Ada/i } },
        { lastName: { $regex: /Ada/i } },
      ],
    });
    expect(res.render).toHaveBeenCalledWith(
      'customer/search',
      expect.any(Object),
    );
  });

  it('renders the about page', () => {
    const req = createRequest();
    const res = createResponse();

    customerController.about(req, res);

    expect(res.render).toHaveBeenCalledWith('customer/about', {
      locals: {
        title: 'About',
        description: 'Free NodeJs User Management System',
      },
    });
  });
});
