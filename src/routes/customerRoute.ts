import express from 'express';
import * as customerController from './../controllers/customerController';
const route = express.Router();

route.get('/', customerController.homepage);
route.get('/add', customerController.addCustomer);
route.post('/add', customerController.postCustomer);
route.get('/view/:id', customerController.viewCustomer);
export default route;
