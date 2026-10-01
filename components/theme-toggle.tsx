"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle({
    resolvedTheme,
    onDarkThemeChange,
}: Readonly<{
    resolvedTheme: "light" | "dark";
    onDarkThemeChange: (checked: boolean) => void;
}>) {

    return (
        <div className="flex min-w-0 items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2.5">
                <span aria-hidden="true" className="relative grid size-4 shrink-0 place-items-center">
                    <Sun
                        className={`absolute size-4 transition-all duration-300 ${resolvedTheme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
                    />
                    <Moon
                        className={`absolute size-4 transition-all duration-300 ${resolvedTheme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
                    />
                </span>
                <span id="dark-theme-label" className="text-xs font-medium">Dark theme</span>
            </span>
            <Switch
                id="dark-theme-switch"
                aria-labelledby="dark-theme-label"
                checked={resolvedTheme === "dark"}
                onCheckedChange={onDarkThemeChange}
            />
        </div>
    );
}
