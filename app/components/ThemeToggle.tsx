"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("jimzhou-theme");
    const useLight = saved === "light";
    document.documentElement.dataset.theme = useLight ? "light" : "dark";
    setLight(useLight);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? "light" : "dark";
    window.localStorage.setItem("jimzhou-theme", next ? "light" : "dark");
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title={light ? "Dark theme" : "Light theme"}
    >
      <span aria-hidden="true">{light ? "☾" : "☼"}</span>
      <small>{light ? "DARK" : "LIGHT"}</small>
    </button>
  );
}
