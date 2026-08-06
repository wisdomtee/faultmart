import {
  BadgeCheck,
  Wrench,
  Sparkles,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

interface ListingBadgeProps {
  condition: string;
}

export default function ListingBadge({
  condition,
}: ListingBadgeProps) {

  const badges: Record<
    string,
    {
      label: string;
      icon: React.ElementType;
      style: string;
    }
  > = {

    BRAND_NEW: {
      label: "Brand New",
      icon: Sparkles,
      style:
        "bg-green-500/90 text-white border-green-300",
    },


    USED: {
      label: "Used",
      icon: BadgeCheck,
      style:
        "bg-blue-500/90 text-white border-blue-300",
    },


    REFURBISHED: {
      label: "Refurbished",
      icon: RefreshCcw,
      style:
        "bg-yellow-500/90 text-white border-yellow-300",
    },


    FAULTY: {
      label: "Faulty",
      icon: Wrench,
      style:
        "bg-orange-600/90 text-white border-orange-300",
    },

  };


  const badge =
    badges[condition] || {
      label: condition.replace(/_/g, " "),
      icon: AlertTriangle,
      style:
        "bg-neutral-700/90 text-white border-neutral-400",
    };


  const Icon = badge.icon;


  return (

    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3.5
        py-1.5
        text-xs
        font-bold
        shadow-lg
        backdrop-blur-sm
        ${badge.style}
      `}
    >

      <Icon
        className="h-3.5 w-3.5"
      />

      {badge.label}

    </span>

  );
}