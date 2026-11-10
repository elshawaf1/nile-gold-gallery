import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

export function WishlistButton({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const { t } = useI18n();
  const saved = has(id);

  return (
    <button
      type="button"
      aria-label={
        saved ? t("wishlist.remove", { name: title }) : t("wishlist.add", { name: title })
      }
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(id);
        toast(added ? t("wishlist.saved") : t("wishlist.removed"), { description: title });
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-border/60 bg-background/85 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-110 hover:border-gold active:scale-95",
        className,
      )}
    >
      <Heart
        key={String(saved)}
        className={cn("size-[18px]", saved ? "animate-pop fill-gold text-gold" : "text-foreground")}
      />
    </button>
  );
}
