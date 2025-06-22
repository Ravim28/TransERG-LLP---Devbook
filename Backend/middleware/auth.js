import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: "Access denied" });
  next();
};
