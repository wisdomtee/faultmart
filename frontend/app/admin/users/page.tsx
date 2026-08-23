"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Shield,
} from "lucide-react";

import {
  getAdminUsers,
  updateAdminUserStatus,
} from "@/lib/api";

type UserStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "BANNED";

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: UserStatus;
  createdAt: string;
}

interface UsersResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] =
    useState<UsersResponse["pagination"] | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "" | UserStatus
  >("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: status || undefined,
      });

      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err: unknown) {
  console.error("ADMIN USERS ERROR:", err);

  const message =
    err instanceof AxiosError
      ? err.response?.data?.message
      : err instanceof Error
        ? err.message
        : undefined;

  setError(
    message ||
      "Failed to load users."
  );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadUsers();
  }, 0);

  return () => window.clearTimeout(timer);
}, [page, status]);

  function handleSearchSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setPage(1);
    loadUsers();
  }

  async function handleStatusChange(
    userId: string,
    newStatus: UserStatus
  ) {
    try {
      setUpdatingUserId(userId);
      setError("");

      await updateAdminUserStatus(
        userId,
        newStatus
      );

      await loadUsers();
    } catch (err: unknown) {
  console.error(
    "UPDATE USER STATUS ERROR:",
    err
  );

  const message =
    err instanceof AxiosError
      ? err.response?.data?.message
      : err instanceof Error
        ? err.message
        : undefined;

  setError(
    message ||
      "Failed to update user status."
  );
} finally {
      setUpdatingUserId(null);
    }
  }

  function getStatusClasses(
    userStatus: UserStatus
  ) {
    switch (userStatus) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700";

      case "PENDING":
        return "bg-amber-100 text-amber-700";

      case "SUSPENDED":
        return "bg-orange-100 text-orange-700";

      case "BANNED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function getRoleClasses(role: string) {
    if (role === "ADMIN") {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "SELLER") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-emerald-600">
          FaultMart Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Users
        </h1>

        <p className="mt-2 text-slate-500">
          Manage FaultMart users and their account
          status.
        </p>
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-4 lg:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as "" | UserStatus
              );
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              All statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="SUSPENDED">
              Suspended
            </option>

            <option value="BANNED">
              Banned
            </option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to complete request
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Users */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Users
                size={22}
                className="text-slate-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                All Users
              </h2>

              <p className="text-sm text-slate-500">
                {pagination
                  ? `${pagination.total} users`
                  : "Loading users..."}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2
                size={22}
                className="animate-spin"
              />

              <span>Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <Users
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status
              filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                            {user.firstName
                              ?.charAt(0)
                              .toUpperCase()}
                            {user.lastName
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {user.firstName}{" "}
                              {user.lastName}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getRoleClasses(
                            user.role
                          )}`}
                        >
                          {user.role ===
                            "ADMIN" && (
                            <Shield size={13} />
                          )}

                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <select
                            value={user.status}
                            disabled={
                              updatingUserId ===
                              user.id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                user.id,
                                event.target
                                  .value as UserStatus
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="PENDING">
                              Pending
                            </option>

                            <option value="ACTIVE">
                              Active
                            </option>

                            <option value="SUSPENDED">
                              Suspended
                            </option>

                            <option value="BANNED">
                              Banned
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="space-y-4 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {user.firstName
                        ?.charAt(0)
                        .toUpperCase()}
                      {user.lastName
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {user.firstName}{" "}
                        {user.lastName}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleClasses(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Joined{" "}
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </span>

                    <select
                      value={user.status}
                      disabled={
                        updatingUserId ===
                        user.id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          user.id,
                          event.target.value as UserStatus
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none disabled:opacity-50"
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="SUSPENDED">
                        Suspended
                      </option>

                      <option value="BANNED">
                        Banned
                      </option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination &&
              pagination.pages > 1 && (
                <div className="flex flex-col gap-4 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Page {pagination.page} of{" "}
                    {pagination.pages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        pagination.page <= 1
                      }
                      onClick={() =>
                        setPage(
                          pagination.page - 1
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={
                        pagination.page >=
                        pagination.pages
                      }
                      onClick={() =>
                        setPage(
                          pagination.page + 1
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}