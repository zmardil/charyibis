"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, Heart, Search, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function getFormString(formData: FormData, name: string) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
}

export default function SignUpPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const { data, error } = await createClient().auth.signUp({
                email: getFormString(formData, "email"),
                password: getFormString(formData, "password"),
                options: {
                    data: { full_name: getFormString(formData, "name") },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            form.reset();
            if (data.session) {
                router.replace("/");
                router.refresh();
                return;
            }

            setSuccessMessage("Account created. Check your email to confirm your address.");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to create your account. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex w-full flex-1 items-center justify-center bg-white px-4 py-8 dark:bg-black sm:px-6 lg:px-10">
            <section className="grid w-full max-w-5xl overflow-hidden shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
                <div className="px-6 py-10 text-foreground sm:px-10 lg:px-12 lg:py-14">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Charybis</p>
                    <h1 className="mt-5 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">A better way to find the right drive.</h1>
                    <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Create a free account and make the vehicle search feel a little more like yours.</p>

                    <div className="mt-10 space-y-5">
                        <div className="flex gap-3">
                            <Search className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                                <h2 className="text-sm font-semibold">Search with confidence</h2>
                                <p className="mt-1 text-sm leading-5 text-muted-foreground">Find models by make, fuel type, mileage, and more.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Heart className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                                <h2 className="text-sm font-semibold">Keep favorites close</h2>
                                <p className="mt-1 text-sm leading-5 text-muted-foreground">Save vehicles you want to compare later.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Bell className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                                <h2 className="text-sm font-semibold">Stay in the loop</h2>
                                <p className="mt-1 text-sm leading-5 text-muted-foreground">Get updates when the listings you care about change.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <div>
                                <h2 className="text-sm font-semibold">Your account, your control</h2>
                                <p className="mt-1 text-sm leading-5 text-muted-foreground">Manage your marketplace activity from one place.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-muted/40 px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Start building your personal vehicle shortlist.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <label className="block text-sm font-medium text-foreground">
                            <span className="mb-2 block">Full name</span>
                            <input className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15" type="text" name="name" autoComplete="name" required />
                        </label>
                        <label className="block text-sm font-medium text-foreground">
                            <span className="mb-2 block">Email address</span>
                            <input className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15" type="email" name="email" autoComplete="email" required />
                        </label>
                        <label className="block text-sm font-medium text-foreground">
                            <span className="mb-2 block">Password</span>
                            <input className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15" type="password" name="password" autoComplete="new-password" minLength={8} required />
                        </label>
                        {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
                        {successMessage && <output className="block text-sm text-emerald-600">{successMessage}</output>}
                        <button className="h-10 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account? <Link className="font-medium text-indigo-600 hover:text-indigo-700" href="/sign-in">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
