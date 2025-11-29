"use client";

import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { registerSchema } from "@/schemas/authSchema";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const result = registerSchema.safeParse({ name, email, password });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Registering...");

    try {
      const res = await api.post("/auth/register", { name, email, password });
      login(res.data.user, res.data.token);
      toast.success("Registered & logged in!", { id: toastId });
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Registration failed", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      <input
        className="border p-3 mb-2 w-full rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        className="border p-3 mb-2 w-full rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="border p-3 mb-2 w-full rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
