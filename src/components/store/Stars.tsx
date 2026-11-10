import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function Stars({ rating, reviews, className }: { rating: number; reviews?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <div className="flex" aria-label={`${rating} out of 5 stars`}>
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
