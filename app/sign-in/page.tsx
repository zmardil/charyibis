"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getFormString(formData: FormData, name: string) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
}

export default function SignInPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        try {
            const { error } = await createClient().auth.signInWithPassword({
                email: getFormString(formData, "email"),
                password: getFormString(formData, "password"),
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            router.replace("/");
            router.refresh();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to log in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 dark:bg-black">
            <section className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">Charybis</p>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Log in to your account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Access saved vehicles and manage your marketplace activity.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-foreground">
                        <span className="mb-2 block">Email address</span>
                        <input className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15" type="email" name="email" autoComplete="email" required />
                    </label>
                    <label className="block text-sm font-medium text-foreground">
                        <span className="mb-2 block">Password</span>
                        <input className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15" type="password" name="password" autoComplete="current-password" required />
                    </label>
                    {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
                    <button className="h-10 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Log in"}</button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    New to Charybis? <Link className="font-medium text-indigo-600 hover:text-indigo-700" href="/sign-up">Create an account</Link>
                </p>
            </section>
        </main>
    );
}
