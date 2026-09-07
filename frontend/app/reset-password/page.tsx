import { Suspense } from "react";

import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto mt-20 max-w-md rounded-2xl border p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500">
            Loading password reset form...
          </p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
