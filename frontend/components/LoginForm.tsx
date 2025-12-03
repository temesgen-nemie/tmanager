"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { loginSchema } from "@/schemas/authSchema";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await api.post("/auth/login", result.data);

      login(res.data.user, res.data.token);

      toast.success("Logged in successfully!", { id: toastId });
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);

      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(axiosError.response?.data?.message || "Login failed", {
          id: toastId,
        });
      } else {
        toast.error("Login failed", { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-4 min-h-screen">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Login</h1>

        {/* Email/Password Login */}
        <input
          type="email"
          className="border p-3 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full py-3 rounded text-white font-medium transition ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center my-2">or</div>

        {/* Google OAuth Login */}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
          className="w-full py-3 text-center bg-red-500 hover:bg-red-600 text-white rounded font-medium transition"
        >
          Login with Google
        </a>
      </div>
    </div>
  );
}
