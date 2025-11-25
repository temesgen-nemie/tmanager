import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema } from '../validators/taskValidator';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = express.Router();

// Custom routes
router.post('/create-post', protect, validate(createTaskSchema), createTask);
router.get('/get-tasks', protect, getTasks);
router.put('/update-task/:id', protect, validate(updateTaskSchema), updateTask);
router.delete('/delete-task/:id', protect, deleteTask);

export default router;
