"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { registerUser } from "@/lib/api";
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

export default function RegisterPage() {

  const router = useRouter();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    console.log("=================================");
    console.log("REGISTER BUTTON CLICKED");
    console.log("EMAIL:", email);
    console.log("=================================");

    setError("");

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      console.log(
        "REGISTER RESPONSE:",
        result
      );

      if (
        !result?.user ||
        !result?.accessToken
      ) {
        throw new Error(
          "Invalid registration response from server."
        );
      }

      /*
       * Store the newly registered user
       * and access token in Zustand.
       */
      setAuth(
        result.user,
        result.accessToken
      );

      /*
       * Verify the Zustand state.
       */
      const authState =
        useAuthStore.getState();

      console.log(
        "================================="
      );
      console.log(
        "AUTH STORE AFTER REGISTRATION:"
      );
      console.log(
        "USER:",
        authState.user
      );
      console.log(
        "USER ID:",
        authState.user?.id
      );
      console.log(
        "USER ROLE:",
        authState.user?.role
      );
      console.log(
        "IS AUTHENTICATED:",
        authState.isAuthenticated
      );
      console.log(
        "ACCESS TOKEN EXISTS:",
        !!authState.accessToken
      );
      console.log(
        "================================="
      );

      toast.success(
        "Account created successfully!"
      );

      router.push("/");
    } catch (err: unknown) {
      console.error(
        "REGISTRATION FAILED:",
        err
      );

      const message = getErrorMessage(
  err,
  "Unable to create your account."
);

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-12 w-full max-w-md px-4 pb-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join FaultMart and start buying and
            selling repairable goods.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* FIRST + LAST NAME */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                placeholder="First name"
                disabled={loading}
                required
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                placeholder="Last name"
                disabled={loading}
                required
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
              />
            </div>

          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              disabled={loading}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="At least 8 characters"
              disabled={loading}
              required
              minLength={8}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Repeat your password"
              disabled={loading}
              required
              minLength={8}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
            />
          </div>

          {/* REGISTER */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex
              w-full
              items-center
              justify-center
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
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}

          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}