import { Response } from 'express';
import Task from '../models/Task';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// 📌 Create a Task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const task = await Task.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// 📌 Get all tasks for the logged-in user
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter: any = { user: req.user._id };
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    // Sorting
    let sort: any = {};
   if (req.query.sortBy) {
  const parts = (req.query.sortBy as string).split(':'); // e.g., "createdAt:desc"
  const key = parts[0];
  const order = parts[1] === 'desc' ? -1 : 1;

  if (key) {
    sort[key] = order;  // ✅ TypeScript knows key is not undefined
  }
}
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      totalPages,
      totalTasks: total,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// 📌 Update a Task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, description, completed },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// 📌 Delete a Task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
