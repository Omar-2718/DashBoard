"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Customer_1 = __importDefault(require("../models/Customer"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};
connectDB();
const data = JSON.parse(fs_1.default.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const addData = async () => {
    try {
        console.log(`Adding ${data.length} customers...`);
        await Customer_1.default.insertMany(data);
        console.log('Data added successfully');
        process.exit();
    }
    catch (err) {
        console.error('Error adding data:', err);
        process.exit(1);
    }
};
const deletData = async () => {
    try {
        await Customer_1.default.deleteMany({});
        console.log('All customers deleted successfully');
        process.exit();
    }
    catch (err) {
        console.error('Error deleting data:', err);
        process.exit(1);
    }
};
if (process.argv[2] === 'insert') {
    addData();
}
else if (process.argv[2] === 'delete') {
    deletData();
}
else {
    console.error('invalid command');
}
