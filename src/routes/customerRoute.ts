import express from 'express';
import * as customerController from './../controllers/customerController';
import { validateResources } from '../middlewares/validateResources';
import {
  createCustomerSchema,
  getCustomerSchema,
} from '../schemas/customerSchema';
const route = express.Router();

route.get('/', customerController.homepage);
route.get('/add', customerController.addCustomer);
route.post(
  '/add',
  validateResources(createCustomerSchema),
  customerController.postCustomer,
);
route.get(
  '/view/:id',
  validateResources(getCustomerSchema),
  customerController.viewCustomer,
);
route.get(
  '/edit/:id',
  validateResources(getCustomerSchema),
  customerController.editCustomer,
);
route.put(
  '/edit/:id',
  validateResources(getCustomerSchema),
  validateResources(createCustomerSchema),
  customerController.updateCustomer,
);
route.delete(
  '/delete/:id',
  validateResources(getCustomerSchema),
  customerController.deleteCustomer,
);
route.post('/search', customerController.searchCustomer);
route.get('/about', customerController.about);
export default route;
