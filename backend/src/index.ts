import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ← ADD THIS
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';

dotenv.config();
connectDB();

const app = express();

// Add CORS middleware - SPECIFIC VERSION
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your React app URL
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (_, res) => res.send('Task Manager API is running 🚀'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Error handler should be LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));