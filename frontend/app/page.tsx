"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div
        className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col 
        items-center justify-center p-10"
      >
        <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
        <p className="text-lg text-center opacity-90">
          Organize your work. Boost productivity ⚡
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm">
          {isLogin ? <LoginForm /> : <RegisterForm />}

          {/* Moved inside the form container and reduced margin */}
          <p className="mt-4 text-center">
            {isLogin ? (
              <>
                Dont have an account?{" "}
                <button
                  className="text-blue-600 font-semibold hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-blue-600 font-semibold hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
