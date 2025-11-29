import { create } from "zustand";
import api from "@/lib/axios";

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (data: { title: string; description?: string }) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/tasks/get-tasks");
      set({ tasks: res.data.tasks });
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (data) => {
    const res = await api.post("/tasks/create-post", data);
    set((state) => ({ tasks: [...state.tasks, res.data.task] }));
  },

  updateTask: async (id, data) => {
    const res = await api.put(`/tasks/update-task/${id}`, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? res.data.task : t)),
    }));
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/delete-task/${id}`);
    set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
  },
}));

export default useTaskStore;
