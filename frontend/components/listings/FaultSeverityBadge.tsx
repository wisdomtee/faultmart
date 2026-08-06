import { AlertTriangle } from "lucide-react";

interface Props {
  severity?: string | null;
}

const styles = {
  MINOR: "bg-green-100 text-green-700",
  MODERATE: "bg-yellow-100 text-yellow-800",
  MAJOR: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-700",
};

export default function FaultSeverityBadge({
  severity,
}: Props) {
  if (!severity) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
        styles[severity as keyof typeof styles]
      }`}
    >
      <AlertTriangle className="h-4 w-4" />
      {severity.replace("_", " ")}
    </span>
  );
}