"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);

      setMessage(
        result?.message ||
          "If an account exists for that email, a password reset link has been sent."
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to request password reset."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border p-8 shadow-sm">
      <h1 className="mb-2 text-3xl font-bold">
        Forgot Password?
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Enter the email address associated with your FaultMart
        account and we&apos;ll send you a password reset link.
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
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

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
            ? "Sending..."
            : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Remember your password?{" "}
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
