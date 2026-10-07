"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Settings } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";

type AccountProfile = Readonly<{ fullName: string; email: string }>;

function getAccountProfile(user: User | null): AccountProfile | null {
    if (!user) return null;

    const metadataName = user.user_metadata?.full_name;
    const fullName = typeof metadataName === "string" && metadataName.trim()
        ? metadataName.trim()
        : user.email?.split("@")[0] || "User";

    return { fullName, email: user.email ?? "" };
}

function getInitialTheme(): "light" | "dark" {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChanges(onChange: () => void) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", onChange);
    window.addEventListener("storage", onChange);
    window.addEventListener("theme-change", onChange);

    return () => {
        mediaQuery.removeEventListener("change", onChange);
        window.removeEventListener("storage", onChange);
        window.removeEventListener("theme-change", onChange);
    };
}

export function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const router = useRouter();
    // The server snapshot keeps hydration stable; the browser snapshot applies
    // saved preferences as soon as React subscribes after hydration.
    const resolvedTheme = useSyncExternalStore(
        subscribeToThemeChanges,
        getInitialTheme,
        (): "light" | "dark" => "light",
    );
    const [profile, setProfile] = useState<AccountProfile | null>(null);
    const displayName = profile?.fullName ?? "";
    const avatarInitial = displayName.trim().charAt(0).toUpperCase();
    const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

    useEffect(() => {
        if (!getSupabaseConfig()) return;

        let isMounted = true;
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setProfile(getAccountProfile(session?.user ?? null));
        });

        void supabase.auth.getUser().then(({ data, error }) => {
            if (isMounted && !error) setProfile(getAccountProfile(data.user));
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemThemeChange = () => {
            const storedTheme = window.localStorage.getItem("theme");
            if (storedTheme !== "light" && storedTheme !== "dark") {
                window.dispatchEvent(new Event("theme-change"));
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }, [resolvedTheme]);

    function handleDarkThemeChange(checked: boolean) {
        const nextTheme = checked ? "dark" : "light";
        window.localStorage.setItem("theme", nextTheme);
        window.dispatchEvent(new Event("theme-change"));
    }

    async function handleSignOut() {
        const { error } = await createClient().auth.signOut();
        if (error) return;

        setProfile(null);
        router.refresh();
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <header>
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
                    <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
                        Charybis
                    </Link>
                    <nav className="flex items-center gap-1 text-sm">
                        <ThemeToggle
                            resolvedTheme={resolvedTheme}
                            onDarkThemeChange={handleDarkThemeChange}
                        />
                        {profile && (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    type="button"
                                    aria-label="Open notifications"
                                    className="inline-flex size-7 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <Bell className="size-4" aria-hidden="true" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-72">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-foreground">Notifications</DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <div className="px-3 py-8 text-center">
                                        <p className="text-sm font-medium text-foreground">You’re all caught up</p>
                                        <p className="mt-1 text-xs text-muted-foreground">No new notifications right now.</p>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {profile ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    aria-label={`Open ${displayName} account menu`}
                                    className="inline-flex h-8 max-w-48 items-center gap-2 rounded-full px-1 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <Avatar size="sm">
                                        <AvatarFallback className="bg-indigo-600 text-xs font-semibold text-white">
                                            {avatarInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="max-w-36 truncate text-xs font-semibold">{displayName}</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
                                                {profile.email && (
                                                    <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
                                                )}
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-xs"
                                        render={<Link href="/settings" />}
                                    >
                                        <Settings className="size-4" aria-hidden="true" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs" variant="destructive" onClick={() => void handleSignOut()}>
                                        <LogOut className="size-4" aria-hidden="true" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href="/sign-in">
                                    Log in
                                </Link>
                                <Link className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700" href="/sign-up">
                                    Create account
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {children}

            <footer className="border-t border-border bg-background">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
                    <p>Charybis vehicle marketplace</p>
                    <div className="flex gap-4">
                        <Link className="hover:text-foreground" href="/">Browse listings</Link>
                        <Link className="hover:text-foreground" href="/sign-in">Log in</Link>
                        <Link className="hover:text-foreground" href="/sign-up">Create account</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
