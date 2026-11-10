import { Star } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  reviews,
  className,
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <div className="flex" aria-label={t("stars.aria", { rating })}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              i <= Math.round(rating) ? "fill-rating text-rating" : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
      <span className="text-muted-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-muted-foreground">({reviews})</span>}
    </div>
  );
}
