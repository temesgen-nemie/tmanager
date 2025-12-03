"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode"; // default import

// Define the JWT payload structure
interface JwtPayload {
  id: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      try {
        // Decode and type the token
        const decoded = jwtDecode<JwtPayload>(token);

        login(
          { id: decoded.id, name: decoded.name, email: decoded.email },
          token
        );

        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to decode token:", error);
        alert("Invalid token. Login failed!");
        router.push("/login");
      }
    } else {
      alert("No token found. Login failed!");
      router.push("/login");
    }
  }, [login, router, searchParams]);

  return <p>Logging you in...</p>;
}
