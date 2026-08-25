"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  ScrollText,
  User,
} from "lucide-react";

import { getAuditLogs } from "@/lib/api";

type AuditUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  description: string;
  metadata?: unknown;
  createdAt: string;
  user?: AuditUser | null;
};

type AuditResponse = {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] =
    useState<AuditResponse["pagination"] | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs(currentPage: number) {
    try {
      setLoading(true);
      setError("");

      const response = await getAuditLogs({
        page: currentPage,
        limit: PAGE_SIZE,
      });

      setLogs(response.data || []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error("AUDIT LOG API ERROR:", err);
      console.error("AUDIT LOG RESPONSE:", err?.response?.data);
      console.error("AUDIT LOG STATUS:", err?.response?.status);

      setError(
        err?.response?.data?.message ||
          `Unable to load audit logs${
            err?.response?.status ? ` (${err.response.status})` : ""
          }. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs(page);
  }, [page]);

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString();
  }

  function getUserName(user?: AuditUser | null) {
    if (!user) {
      return "System";
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return name || user.email || "Unknown user";
  }

  function getActionClasses(action: string) {
    switch (action.toUpperCase()) {
      case "APPROVE":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

      case "REJECT":
        return "bg-red-50 text-red-700 ring-red-600/20";

      case "UPDATE":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";

      case "DELETE":
        return "bg-red-50 text-red-700 ring-red-600/20";

      case "CREATE":
        return "bg-purple-50 text-purple-700 ring-purple-600/20";

      default:
        return "bg-slate-100 text-slate-700 ring-slate-600/20";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ScrollText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Audit Logs
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track administrative actions across the FaultMart platform.
              </p>
            </div>
          </div>
        </div>

        {pagination && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="font-semibold text-slate-900">
              {pagination.total}
            </span>{" "}
            total log{pagination.total === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Something went wrong</p>

            <p className="mt-1 text-sm">{error}</p>

            <button
              type="button"
              onClick={() => loadLogs(page)}
              className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 size={20} className="animate-spin" />

              <span className="text-sm">Loading audit logs...</span>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FileText size={24} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No audit logs found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Administrative actions will appear here once they are recorded.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Administrator
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Entity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Administrator */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <User size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {getUserName(log.user)}
                            </p>

                            {log.user?.email && (
                              <p className="truncate text-xs text-slate-500">
                                {log.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getActionClasses(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {log.entity}
                          </p>

                          {log.entityId && (
                            <p className="mt-1 max-w-[180px] truncate font-mono text-xs text-slate-400">
                              {log.entityId}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-[420px] px-6 py-5">
                        <p className="text-sm text-slate-700">
                          {log.description || "—"}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={15} className="text-slate-400" />

                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.pages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= pagination.pages || loading}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(pagination.pages, current + 1)
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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