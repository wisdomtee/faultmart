interface Props {
  price: number | string;
  currency: string;
}

export default function ListingPrice({
  price,
  currency,
}: Props) {
  const numericPrice = Number(price);

  return (
    <div className="flex items-baseline gap-2">
      <span
        className="
          text-2xl
          font-black
          tracking-tight
          text-orange-600
        "
      >
        {currency}
      </span>

      <span
        className="
          text-3xl
          font-black
          tracking-tight
          text-neutral-950
        "
      >
        {Number.isFinite(numericPrice)
          ? numericPrice.toLocaleString()
          : "—"}
      </span>
    </div>
  );
}