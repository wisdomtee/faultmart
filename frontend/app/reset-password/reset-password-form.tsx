"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { resetPassword } from "@/lib/api";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        "This password reset link is missing or invalid."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError(
        "Password must contain at least one number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(
        token,
        password
      );

      setMessage(
        result?.message ||
          "Password reset successful. You can now sign in."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border p-8 shadow-sm">
      <h1 className="mb-2 text-3xl font-bold">
        Reset Password
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Create a new password for your FaultMart account.
      </p>

      {message && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          className="w-full rounded-xl border p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <input
          className="w-full rounded-xl border p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          disabled={loading}
          required
        />

        <p className="text-xs text-gray-500">
          Password must be at least 8 characters and include
          uppercase, lowercase, and a number.
        </p>

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
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link
          href="/login"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
