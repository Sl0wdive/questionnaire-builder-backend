import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connected successfully.');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); 
  }
};

export default connectDB;