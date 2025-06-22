import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 5);
  const user = await User.create({ name, email, password: hashed, role });
  res.status(201).json({ msg: 'User registered' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, 'SECRET_KEY');
  res.json({ token, user: { name: user.name, role: user.role } });
};
