export default function SettingsPage() {
    return (
        <main className="w-full flex-1 bg-white px-5 py-8 text-foreground dark:bg-black sm:px-8 sm:py-10">
            <div className="mx-auto max-w-4xl">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage your Charybis preferences.
                    </p>
                </header>

                <section className="rounded-xl border border-border bg-background p-5 sm:p-6" aria-labelledby="appearance-heading">
                    <h2 id="appearance-heading" className="text-base font-semibold">Appearance</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Use the theme button in the navbar to switch between light and dark themes.
                    </p>
                </section>
            </div>
        </main>
    );
}
