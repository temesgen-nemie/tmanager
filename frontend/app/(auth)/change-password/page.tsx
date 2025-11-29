"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating password...");

    try {
      await api.put("/users/change-password", { oldPassword, newPassword });
      toast.success("Password updated!", { id: toastId });
      router.push("/dashboard");
    } catch (error: unknown) {
      let message = "Failed to update password";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      }

      toast.error(message, { id: toastId });
    } finally {
      setIsLoading(false);
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="border p-3 mb-3 w-full max-w-sm rounded"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-3 mb-3 w-full max-w-sm rounded"
      />
      <button
        onClick={handleChangePassword}
        disabled={isLoading}
        className={`bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}
