import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useTheme, ThemeProvider } from "@/lib/theme";
import { setPrefersDark } from "@/test/setup";

function Probe() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle}>
      {theme}
    </button>
  );
}

function renderProvider() {
  return render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
}

const root = document.documentElement;

beforeEach(() => {
  window.localStorage.clear();
  root.classList.remove("dark");
  root.style.colorScheme = "";
  setPrefersDark(false);
});

afterEach(() => {
  setPrefersDark(false);
});

describe("ThemeProvider", () => {
  it("defaults to the warm light theme", async () => {
    renderProvider();
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("light"));
    expect(root).not.toHaveClass("dark");
    expect(root.style.colorScheme).toBe("light");
  });

  it("ignores the system preference and stays light by default", async () => {
    setPrefersDark(true);
    renderProvider();
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("light"));
    expect(root).not.toHaveClass("dark");
  });

  it("lets a stored choice override the system preference", async () => {
    window.localStorage.setItem("safa-theme", "light");
    setPrefersDark(true);
    renderProvider();
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("light"));
    expect(root).not.toHaveClass("dark");
  });

  it("toggles, applies and persists the theme", async () => {
    renderProvider();
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("light"));

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("dark"));
    expect(root).toHaveClass("dark");
    expect(window.localStorage.getItem("safa-theme")).toBe("dark");

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("light"));
    expect(root).not.toHaveClass("dark");
    expect(window.localStorage.getItem("safa-theme")).toBe("light");
  });
});
