import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { env } from '../config/env';
import { validateRegister, validateLogin } from '../validators';
import { createError } from '../utils/errors';

const generateToken = (id: string, name: string, email: string): string => {
  return jwt.sign({ id, name, email }, env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (body: any) => {
  const { isValid, errors } = validateRegister(body);
  if (!isValid) {
    throw createError(errors.join(', '), 400);
  }

  const { name, email, password } = body;

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw createError('User with this email already exists', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken(user._id.toString(), user.name, user.email);

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUser = async (body: any) => {
  const { isValid, errors } = validateLogin(body);
  if (!isValid) {
    throw createError(errors.join(', '), 400);
  }

  const { email, password } = body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createError('Invalid email or password', 400);
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError('Invalid email or password', 400);
  }

  // Generate token
  const token = generateToken(user._id.toString(), user.name, user.email);

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};
