import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial preference from document or localStorage
    const savedTheme = localStorage.getItem("aim_theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aim_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("aim_theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Theme (Dark / Ivory Light)"
      className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-[#C9A24B]/40 hover:bg-[#C9A24B]/10 flex items-center justify-center text-slate-300 hover:text-[#C9A24B] transition-all duration-200"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#C9A24B]" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
