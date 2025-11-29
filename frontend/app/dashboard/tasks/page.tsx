"use client";

import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}
