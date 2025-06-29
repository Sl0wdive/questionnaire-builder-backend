import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

export class UserService {
  static registerUser = async (email, fullName, password) => {

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      throw { status: 409, message: 'Email already exists.' };
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email,
      fullName,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name }, 
      JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );

    return token;
  }

  static loginUser = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw { status: 401, message: 'Invalid credentials.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid credentials.' };
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    return token;
  }

  static getCurrentUser = async (userId) => {
    const user = await UserModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return user;
  }
}