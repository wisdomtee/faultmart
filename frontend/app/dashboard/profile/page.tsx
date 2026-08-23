"use client";

import { FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth-store";
import {
  User,
  Mail,
  Phone,
  AtSign,
  ShieldCheck,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Trash2,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount,
} from "@/lib/api";

import { useRouter } from "next/navigation";

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  verificationStatus: string;
  profileImage?: string | null;
  bio?: string | null;
  gender?: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, setAuth, accessToken } = useAuthStore();
  

  const [profile, setProfile] = useState<Profile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [changingPassword, setChangingPassword] = useState(false);
const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");

const [deletingAccount, setDeletingAccount] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await getMyProfile();

        if (cancelled) {
          return;
        }

        setProfile(data);

        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setUsername(data.username ?? "");
        setPhone(data.phone ?? "");
        setGender(data.gender ?? "");
        setBio(data.bio ?? "");
        setError("");
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        setError(
          getErrorMessage(
            err,
            "Failed to load your profile."
          )
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedUser = await updateMyProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim() || undefined,
        phone: phone.trim() || undefined,
        gender: gender || null,
        bio: bio.trim() || null,
      });

      setProfile(updatedUser);

      /*
       * Keep the Zustand user in sync with the updated profile.
       * The existing access token is preserved.
       */
      if (user && accessToken) {
        setAuth(
          {
            ...user,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage ?? undefined,
          },
          accessToken
        );
      }

      setSuccess("Profile updated successfully.");

      window.setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err: unknown) {
  setError(
    getErrorMessage(
      err,
      "Failed to update your profile."
    )
  );
} finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setPasswordError("");
  setPasswordSuccess("");

  if (newPassword.length < 8) {
    setPasswordError(
      "New password must be at least 8 characters long."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError(
      "New password and confirmation password do not match."
    );
    return;
  }

  try {
    setChangingPassword(true);

    await changeMyPassword({
      currentPassword,
      newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordSuccess(
      "Password changed successfully."
    );

    window.setTimeout(() => {
      setPasswordSuccess("");
    }, 4000);
  } catch (err: unknown) {
  setPasswordError(
    getErrorMessage(
      err,
      "Failed to change your password."
    )
  );
} finally {
    setChangingPassword(false);
  }
}

async function handleDeleteAccount() {
  try {
    setDeletingAccount(true);
    setDeleteError("");

    await deleteMyAccount();

    setAuth(
      {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      },
      ""
    );

    router.push("/");
  } catch (err: unknown) {
  console.error("Delete account failed:", err);

  setDeleteError(
    getErrorMessage(
      err,
      "Failed to delete your account."
    )
  );

  setDeletingAccount(false);
}
}

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading your profile...
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Unable to load profile
                </p>

                <p className="mt-1 text-sm">
                  {error ||
                    "Your profile could not be loaded."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" />

              <p className="text-sm font-medium">
                {success}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {profile.firstName} {profile.lastName}
              </h2>

              {profile.username && (
                <p className="mt-1 text-sm text-slate-500">
                  @{profile.username}
                </p>
              )}

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {profile.role}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {profile.status}
                </span>
              </div>

              <div className="mt-6 w-full border-t pt-5 text-left">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Verification
                    </p>

                    <p className="text-sm font-semibold text-slate-900">
                      {profile.verificationStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Edit profile */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Personal information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the information associated with your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* First name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    First name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Last name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Last name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={profile.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-500"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Username
                </label>

                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Choose a username"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+234..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bio
                </label>

                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value)
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder="Tell other FaultMart users a little about yourself..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {bio.length}/1000
                </p>
              </div>

              {/* Save */}
              <div className="flex justify-end border-t pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Security */}
<section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex items-start gap-4">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
      <Lock className="h-5 w-5 text-slate-600" />
    </div>

    <div>
      <h2 className="font-bold text-slate-900">
        Password & security
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Change your password to keep your account secure.
      </p>
    </div>
  </div>

  <form
    onSubmit={handleChangePassword}
    className="mt-6 space-y-5"
  >
    {passwordError && (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

        <p className="text-sm font-medium">
          {passwordError}
        </p>
      </div>
    )}

    {passwordSuccess && (
      <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
        <CheckCircle2 className="h-5 w-5 shrink-0" />

        <p className="text-sm font-medium">
          {passwordSuccess}
        </p>
      </div>
    )}

    <div className="grid gap-5 md:grid-cols-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Current password
        </label>

        <input
          type="password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          New password
        </label>

        <input
          type="password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm new password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>

    <div className="flex justify-end border-t pt-5">
      <button
        type="submit"
        disabled={changingPassword}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {changingPassword ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Changing password...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Change password
          </>
        )}
      </button>
    </div>
  </form>
</section>

        {/* Danger zone */}
<section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
      <Trash2 className="h-5 w-5 text-red-600" />
    </div>

    <div className="flex-1">
      <h2 className="font-bold text-red-700">
        Danger zone
      </h2>

      <p className="mt-1 text-sm text-slate-600">
        Deactivate your FaultMart account. Your account will no
        longer be available for normal use.
      </p>

      {deleteError && (
        <p className="mt-3 text-sm font-medium text-red-600">
          {deleteError}
        </p>
      )}
    </div>

    <button
      type="button"
      onClick={() => {
        setDeleteError("");
        setShowDeleteConfirm(true);
      }}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      Delete account
    </button>
  </div>
</section>
      </div>
      {showDeleteConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">
        Delete your account?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        This will deactivate your FaultMart account. You will
        be signed out and will no longer be able to use the
        account normally.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          disabled={deletingAccount}
          onClick={() => setShowDeleteConfirm(false)}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={deletingAccount}
          onClick={handleDeleteAccount}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deletingAccount ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete account
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}