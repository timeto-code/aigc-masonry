"use client";

import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      <Palette size={20} />
    </Button>
  );
}
