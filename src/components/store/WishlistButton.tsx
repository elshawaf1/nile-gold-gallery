import { Heart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

export function WishlistButton({ id, title, className }: { id: string; title: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const saved = has(id);

  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(id);
        toast(added ? "Saved to wishlist" : "Removed from wishlist", { description: title });
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95",
        className,
      )}
    >
      <Heart
        key={String(saved)}
        className={cn("size-[18px]", saved ? "animate-pop fill-destructive text-destructive" : "text-foreground")}
      />
    </button>
  );
}
