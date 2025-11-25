import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// 1️⃣ Get current user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

// 2️⃣ Update profile (name/email)
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const { name, email } = req.body;

  if (email) {
    const emailExists = await User.findOne({ email });
  if (emailExists && (emailExists._id as string) !== req.user._id as string) {
  return res.status(400).json({ message: 'Email already in use' });
}
  }

  req.user.name = name || req.user.name;
  req.user.email = email || req.user.email;

  await req.user.save();

  res.status(200).json({
    message: 'Profile updated successfully',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

// 3️⃣ Change password
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const { oldPassword, newPassword } = req.body;

  // Validate request body
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Both oldPassword and newPassword are required',
    });
  }

  // Fetch user with password from DB (password is excluded in JWT middleware)
  const userWithPassword = await User.findById(req.user._id);
  if (!userWithPassword || !userWithPassword.password) {
    return res.status(500).json({
      success: false,
      message: 'User password not found',
    });
  }

  // Compare old password
  const isMatch = await bcrypt.compare(oldPassword, userWithPassword.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Old password is incorrect' });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  userWithPassword.password = await bcrypt.hash(newPassword, salt);

  await userWithPassword.save();

  res.status(200).json({ success: true, message: 'Password changed successfully' });
};
