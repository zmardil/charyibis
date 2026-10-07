"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
    resolvedTheme,
    onDarkThemeChange,
}: Readonly<{
    resolvedTheme: "light" | "dark";
    onDarkThemeChange: (checked: boolean) => void;
}>) {

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    const Icon = resolvedTheme === "dark" ? Sun : Moon;

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
            onClick={() => onDarkThemeChange(nextTheme === "dark")}
        >
            <Icon className="size-4" aria-hidden="true" />
        </Button>
    );
}
