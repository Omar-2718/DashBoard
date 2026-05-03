"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController = __importStar(require("./../controllers/customerController"));
const validateResources_1 = require("../middlewares/validateResources");
const customerSchema_1 = require("../schemas/customerSchema");
const route = express_1.default.Router();
route.get('/', customerController.homepage);
route.get('/add', customerController.addCustomer);
route.post('/add', (0, validateResources_1.validateResources)(customerSchema_1.createCustomerSchema), customerController.postCustomer);
route.get('/view/:id', (0, validateResources_1.validateResources)(customerSchema_1.getCustomerSchema), customerController.viewCustomer);
route.get('/edit/:id', (0, validateResources_1.validateResources)(customerSchema_1.getCustomerSchema), customerController.editCustomer);
route.put('/edit/:id', (0, validateResources_1.validateResources)(customerSchema_1.getCustomerSchema), (0, validateResources_1.validateResources)(customerSchema_1.createCustomerSchema), customerController.updateCustomer);
route.delete('/delete/:id', (0, validateResources_1.validateResources)(customerSchema_1.getCustomerSchema), customerController.deleteCustomer);
route.post('/search', customerController.searchCustomer);
route.get('/about', customerController.about);
exports.default = route;
