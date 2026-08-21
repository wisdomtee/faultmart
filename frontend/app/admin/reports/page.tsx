"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  getAdminReports,
  updateAdminReportStatus,
} from "@/lib/api";

type ReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "ACTION_TAKEN"
  | "DISMISSED";

interface Report {
  id: string;
  reporterId: string;
  listingId?: string | null;
  reportedUserId?: string | null;

reportedUser?: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
} | null;
  reason: string;
  description?: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;

  reporter?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;

  listing?: {
    id: string;
    title: string;
  } | null;
}

interface ReportsResponse {
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const STATUS_OPTIONS: {
  value: ReportStatus | "ALL";
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All Reports",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "UNDER_REVIEW",
    label: "Under Review",
  },
  {
    value: "ACTION_TAKEN",
    label: "Action Taken",
  },
  {
    value: "DISMISSED",
    label: "Dismissed",
  },
];

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString();
}

function getReporterName(
  reporter?: Report["reporter"]
) {
  if (!reporter) {
    return "Unknown user";
  }

  const name = [
    reporter.firstName,
    reporter.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || reporter.email || "Unknown user";
}

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "UNDER_REVIEW":
      return "Under Review";

    case "ACTION_TAKEN":
      return "Action Taken";

    case "DISMISSED":
      return "Dismissed";

    default:
      return status;
  }
}

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "UNDER_REVIEW":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "ACTION_TAKEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "DISMISSED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<
    Report[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<ReportStatus | "ALL">("ALL");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState<
      ReportsResponse["pagination"] | null
    >(null);

  const limit = 20;

  async function loadReports(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getAdminReports({
          page,
          limit,
          ...(statusFilter !== "ALL"
            ? {
                status: statusFilter,
              }
            : {}),
        });

      setReports(response.data || []);
      setPagination(
        response.pagination || null
      );
    } catch (error: any) {
      console.error(
        "ADMIN REPORTS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, [page, statusFilter]);

  async function handleStatusChange(
    reportId: string,
    status: ReportStatus
  ) {
    try {
      setUpdatingId(reportId);
      setError("");

      const updated =
        await updateAdminReportStatus(
          reportId,
          status
        );

      setReports((current) =>
        current.map((report) =>
          report.id === reportId
            ? {
                ...report,
                ...updated,
                status,
              }
            : report
        )
      );
    } catch (error: any) {
      console.error(
        "UPDATE REPORT STATUS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to update report status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleFilterChange(
    value: ReportStatus | "ALL"
  ) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">
            Trust & Safety
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            Review reports submitted by FaultMart users
            and take appropriate action.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadReports(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Reports
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {pagination?.total ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <Flag size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {statusFilter === "PENDING"
                  ? reports.length
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Under Review
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {statusFilter ===
                "UNDER_REVIEW"
                  ? reports.length
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ShieldAlert size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Action Taken
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {statusFilter ===
                "ACTION_TAKEN"
                  ? reports.length
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />

            <p className="text-sm font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Search
              size={18}
              className="text-slate-400"
            />

            <span className="text-sm font-semibold text-slate-700">
              Filter reports
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(
              (option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleFilterChange(
                      option.value
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    statusFilter ===
                    option.value
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2
                size={24}
                className="animate-spin"
              />

              <span className="font-medium">
                Loading reports...
              </span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
              <Flag size={28} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No reports found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are no reports matching the
              selected filter.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Report
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Reporter
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Target
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {reports.map(
                    (report) => (
                      <tr
                        key={report.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="max-w-xs">
                            <p className="font-semibold text-slate-900">
                              {report.reason}
                            </p>

                            {report.description && (
                              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                {
                                  report.description
                                }
                              </p>
                            )}

                            <p className="mt-2 font-mono text-xs text-slate-400">
                              #{report.id.slice(
                                0,
                                8
                              )}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium text-slate-900">
                              {getReporterName(
                                report.reporter
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                report
                                  .reporter
                                  ?.email
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          {report.listing ? (
                            <div>
                              <p className="font-medium text-slate-900">
                                {
                                  report
                                    .listing
                                    .title
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Listing
                              </p>
                            </div>
                          ) : report.reportedUser ? (
  <div>
    <p className="font-medium text-slate-900">
      {[
        report.reportedUser.firstName,
        report.reportedUser.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
        report.reportedUser.email ||
        "Reported user"}
    </p>

    {report.reportedUser.email && (
      <p className="mt-1 text-xs text-slate-500">
        {report.reportedUser.email}
      </p>
    )}

    <p className="mt-1 text-xs text-slate-400">
      User
    </p>
  </div>
) : report.reportedUserId ? (
  <div>
    <p className="font-medium text-slate-900">
      Reported user
    </p>

    <p className="mt-1 font-mono text-xs text-slate-500">
      {report.reportedUserId.slice(0, 8)}
    </p>
  </div>
) : (
                            <span className="text-sm text-slate-400">
                              Unknown target
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                          {formatDate(
                            report.createdAt
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              report.status
                            )}`}
                          >
                            {getStatusLabel(
                              report.status
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {report.status ===
                              "PENDING" && (
                              <button
                                type="button"
                                disabled={
                                  updatingId ===
                                  report.id
                                }
                                onClick={() =>
                                  handleStatusChange(
                                    report.id,
                                    "UNDER_REVIEW"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingId ===
                                report.id ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Eye
                                    size={14}
                                  />
                                )}

                                Review
                              </button>
                            )}

                            {report.status ===
                              "UNDER_REVIEW" && (
                              <>
                                <button
                                  type="button"
                                  disabled={
                                    updatingId ===
                                    report.id
                                  }
                                  onClick={() =>
                                    handleStatusChange(
                                      report.id,
                                      "ACTION_TAKEN"
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {updatingId ===
                                  report.id ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2
                                      size={14}
                                    />
                                  )}

                                  Action Taken
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    updatingId ===
                                    report.id
                                  }
                                  onClick={() =>
                                    handleStatusChange(
                                      report.id,
                                      "DISMISSED"
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <XCircle
                                    size={14}
                                  />

                                  Dismiss
                                </button>
                              </>
                            )}

                            {report.status ===
                              "ACTION_TAKEN" && (
                              <span className="text-xs font-medium text-emerald-600">
                                Resolved
                              </span>
                            )}

                            {report.status ===
                              "DISMISSED" && (
                              <span className="text-xs font-medium text-slate-500">
                                Dismissed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination &&
              pagination.pages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                  <p className="text-sm text-slate-500">
                    Page{" "}
                    <span className="font-semibold text-slate-700">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {pagination.pages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        pagination.page <= 1
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              1,
                              current - 1
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={16}
                      />

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
                          (current) =>
                            Math.min(
                              pagination.pages,
                              current + 1
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next

                      <ChevronRight
                        size={16}
                      />
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