/** Animates a copy of a product image flying into the cart button. */
export function flyToCart(source: HTMLElement | null) {
  if (!source || typeof window === "undefined") return;
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("class");
  Object.assign(clone.style, {
    position: "fixed",
    left: `${s.left}px`,
    top: `${s.top}px`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    objectFit: "cover",
    borderRadius: "14px",
    zIndex: "100",
    pointerEvents: "none",
    margin: "0",
  });
  document.body.appendChild(clone);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);
  const anim = clone.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.4 - 60}px) scale(0.5)`, opacity: 0.9, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.3 },
    ],
    { duration: 750, easing: "cubic-bezier(0.55, 0, 0.35, 1)" },
  );
  anim.onfinish = () => {
    clone.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease-out" },
    );
  };
}
