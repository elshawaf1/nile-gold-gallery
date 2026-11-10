import { Moon, Sun } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("theme.toggle")}
      title={dark ? t("theme.light") : t("theme.dark")}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-border/70 bg-card/70 text-foreground transition-colors hover:border-gold hover:text-gold",
        className,
      )}
    >
      {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
