"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.about = exports.searchCustomer = exports.deleteCustomer = exports.updateCustomer = exports.editCustomer = exports.viewCustomer = exports.postCustomer = exports.addCustomer = exports.homepage = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const homepage = async (req, res) => {
    const messages = req.flash('info');
    const locals = {
        title: 'NodeJs',
        description: 'Free NodeJs User Management System',
    };
    const perPage = 10;
    const page = Number(req.query.page) || 1;
    const customers = await Customer_1.default.aggregate([
        {
            $sort: {
                updatedAt: -1,
            },
        },
    ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    const customerCount = await Customer_1.default.countDocuments();
    res.render('index', {
        locals,
        messages,
        customers,
        current: page,
        pages: Math.ceil(customerCount / perPage),
    });
};
exports.homepage = homepage;
const addCustomer = (req, res) => {
    const locals = {
        title: 'Add New Customer',
        description: 'Free NodeJs User Management System',
    };
    res.render('customer/add', locals);
};
exports.addCustomer = addCustomer;
const postCustomer = async (req, res) => {
    console.log(req.body);
    const newCustomer = new Customer_1.default({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        email: req.body.email,
        tel: req.body.tel,
    });
    await Customer_1.default.create(newCustomer);
    req.flash('info', 'Customer added successfully');
    res.redirect('/');
};
exports.postCustomer = postCustomer;
const viewCustomer = async (req, res, next) => {
    const id = req.params.id;
    const customer = await Customer_1.default.findOne({ _id: id });
    if (!customer) {
        return next(new AppError_1.default('Customer not found', 404));
    }
    const locals = {
        title: 'View Customer',
        description: 'Free NodeJs User Management System',
    };
    res.render('customer/view', { locals, customer });
};
exports.viewCustomer = viewCustomer;
const editCustomer = async (req, res, next) => {
    const id = req.params.id;
    const locals = {
        title: 'Edit Customer',
        description: 'Free NodeJs User Management System',
    };
    const customer = await Customer_1.default.findOne({ _id: id });
    if (!customer) {
        return next(new AppError_1.default('Customer not found', 404));
    }
    res.render('customer/edit', { locals, customer });
};
exports.editCustomer = editCustomer;
const updateCustomer = async (req, res, next) => {
    const id = req.params.id;
    const customer = await Customer_1.default.findByIdAndUpdate(id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        email: req.body.email,
        tel: req.body.tel,
        updatedAt: new Date(),
    });
    if (!customer) {
        return next(new AppError_1.default('Customer not found', 404));
    }
    req.flash('info', 'Customer updated successfully');
    res.redirect('/');
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res, next) => {
    const id = req.params.id;
    await Customer_1.default.findByIdAndDelete(id);
    req.flash('info', 'Customer deleted successfully');
    res.redirect('/');
};
exports.deleteCustomer = deleteCustomer;
const searchCustomer = async (req, res) => {
    const searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');
    const customers = await Customer_1.default.find({
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
exports.searchCustomer = searchCustomer;
const about = (req, res) => {
    const locals = {
        title: 'About',
        description: 'Free NodeJs User Management System',
    };
    res.render('customer/about', { locals });
};
exports.about = about;
