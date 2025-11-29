"use client";

import { useState } from "react";
import useTaskStore from "@/store/useTaskStore";
import TaskForm from "./TaskForm";
import toast from "react-hot-toast";

export default function TaskList() {
  const { tasks, deleteTask } = useTaskStore();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  if (tasks.length === 0) return <p>No tasks yet.</p>;

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      {tasks.map((task) => (
        <div key={task._id} className="p-2 border-b last:border-none">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setEditingTaskId(task._id)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={async () => {
                  await deleteTask(task._id);
                  toast.success("Task deleted!");
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Inline Edit Form */}
          {editingTaskId === task._id && (
            <TaskForm
              taskToEdit={task}
              onCloseEdit={() => setEditingTaskId(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
