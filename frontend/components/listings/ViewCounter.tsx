import { Eye } from "lucide-react";

interface Props {
  views: number;
}

export default function ViewCounter({ views }: Props) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Eye className="h-4 w-4" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}