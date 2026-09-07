import { Resend } from "resend";

import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const { error } = await resend.emails.send({
    from: env.MAIL_FROM,
    to: email,
    subject: "Reset your FaultMart password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;padding:32px;">
            <h1 style="margin:0 0 16px;color:#111827;">
              Reset your FaultMart password
            </h1>

            <p style="color:#4b5563;line-height:1.6;">
              We received a request to reset the password for your FaultMart account.
            </p>

            <p style="color:#4b5563;line-height:1.6;">
              Click the button below to choose a new password.
            </p>

            <p style="margin:28px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  background:#ea580c;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 24px;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>
            </p>

            <p style="color:#6b7280;font-size:14px;line-height:1.6;">
              This link expires in 30 minutes and can only be used once.
            </p>

            <p style="color:#6b7280;font-size:14px;line-height:1.6;">
              If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

            <p style="color:#9ca3af;font-size:12px;">
              FaultMart — The marketplace for repairable goods.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("PASSWORD RESET EMAIL FAILED:", error);
    throw new Error("Unable to send password reset email.");
  }
}
