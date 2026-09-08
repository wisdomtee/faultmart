"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}

export default function LoginPage() {
  const router = useRouter();

    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

        setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

            if (!result?.user || !result?.accessToken) {
  throw new Error(
    "Invalid login response from server."
  );
}

console.log("LOGIN USER:", result.user);
console.log("LOGIN ROLE:", result.user.role);

if (
  result.user.role === "SUPER_ADMIN" ||
  result.user.role === "ADMIN"
) {
  router.push("/admin");
} else {
  router.push("/dashboard");
}
    } catch (err: unknown) {
  console.error(
    "LOGIN FAILED:",
    err
  );

  const message = getErrorMessage(
    err,
    "Unable to log in. Please check your email and password."
  );

  setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border p-8 shadow-sm">
      <h1 className="mb-2 text-3xl font-bold">
        Login
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Log in to your FaultMart account.
      </p>

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          className="w-full rounded-xl border p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          disabled={loading}
          required
        />

        <input
          className="w-full rounded-xl border p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          disabled={loading}
          required
        />

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Forgot password?
            </Link>
          </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-orange-600
            py-3
            font-bold
            text-white
            transition
            hover:bg-orange-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      {/* REGISTER LINK */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
