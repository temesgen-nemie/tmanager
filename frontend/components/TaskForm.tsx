"use client";

import { useState, useEffect } from "react";
import useTaskStore from "@/store/useTaskStore";
import toast from "react-hot-toast";

interface TaskFormProps {
  taskToEdit?: { _id: string; title: string; description?: string };
  onCloseEdit?: () => void;
}

export default function TaskForm({ taskToEdit, onCloseEdit }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
    }
  }, [taskToEdit]);

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(
      taskToEdit ? "Updating task..." : "Adding task..."
    );

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, { title, description });
        toast.success("Task updated successfully!", { id: toastId });
        if (onCloseEdit) onCloseEdit();
      } else {
        await addTask({ title, description });
        toast.success("Task added successfully!", { id: toastId });
      }
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toast.error("Operation failed", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white mb-4 shadow">
      <h2 className="text-lg font-semibold mb-2">
        {taskToEdit ? "Edit Task" : "Create a New Task"}
      </h2>
      <input
        className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className={`w-full py-2 rounded text-white font-medium ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading
          ? taskToEdit
            ? "Updating..."
            : "Adding..."
          : taskToEdit
          ? "Update Task"
          : "Add Task"}
      </button>
    </div>
  );
}
