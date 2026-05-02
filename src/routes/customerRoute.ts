import express from 'express';
import * as customerController from './../controllers/customerController';
const route = express.Router();

route.get('/', customerController.homepage);
route.get('/add', customerController.addCustomer);
route.post('/add', customerController.postCustomer);
route.get('/view/:id', customerController.viewCustomer);
route.get('/edit/:id', customerController.editCustomer);
route.put('/edit/:id', customerController.updateCustomer);
route.delete('/delete/:id', customerController.deleteCustomer);
route.post('/search', customerController.searchCustomer);
route.get('/about', customerController.about);
export default route;
