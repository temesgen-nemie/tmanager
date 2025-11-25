import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import { updateProfileSchema, changePasswordSchema } from '../validators/userValidator';
import { getProfile, updateProfile, changePassword } from '../controllers/userController';

const router = express.Router();

// Protected user routes
router.get('/me', protect, getProfile);
router.put('/update-profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;
