import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer';
import fs from 'fs';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};
connectDB();
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'),
);

const addData = async () => {
  try {
    console.log(`Adding ${data.length} customers...`);
    await Customer.insertMany(data);
    console.log('Data added successfully');
    process.exit();
  } catch (err) {
    console.error('Error adding data:', err);
    process.exit(1);
  }
};
const deletData = async () => {
  try {
    await Customer.deleteMany({});
    console.log('All customers deleted successfully');
    process.exit();
  } catch (err) {
    console.error('Error deleting data:', err);
    process.exit(1);
  }
};
if (process.argv[2] === 'insert') {
  addData();
} else if (process.argv[2] === 'delete') {
  deletData();
} else {
  console.error('invalid command');
}
