"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useTaskStore from "@/store/useTaskStore";
import Navbar from "@/components/Navbar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, hasHydrated } = useAuthStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    if (hasHydrated && !isLoggedIn) {
      router.push("/"); // redirect if not logged in
    } else if (isLoggedIn) {
      fetchTasks(); // fetch tasks after login
    }
  }, [isLoggedIn, hasHydrated, fetchTasks, router]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar includes Profile component */}
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        {/* Task Creation Form */}
        <TaskForm />

        {/* Task List */}
        <TaskList />
      </div>
    </div>
  );
}
