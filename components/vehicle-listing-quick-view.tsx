import { ArrowUpRight, MapPin } from "lucide-react";

import { VehicleGallery } from "@/components/vehicle-gallery";
import type { VehicleListingData } from "@/lib/vehicle-listing-types";

export function VehicleListingQuickView({
    listing,
}: Readonly<{ listing: VehicleListingData }>) {
    const details = listing.details ?? {};
    const title = [
        listing.make,
        details.model,
        details.yearOfManufacture,
        details.trimEdition,
    ].filter(Boolean).join(" ") || listing.title;
    const specifications = [
        { label: "Year", value: details.yearOfManufacture },
        { label: "Mileage", value: listing.mileage },
        { label: "Engine", value: listing.engine },
        { label: "Fuel", value: listing.fuel },
        { label: "Transmission", value: listing.transmission },
        { label: "Color", value: details.color },
    ].filter((item): item is { label: string; value: string } => Boolean(item.value));

    return (
        <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <div className="min-w-0 bg-popover">
                <VehicleGallery listing={listing} bleed />
            </div>

            <div className="flex min-h-full min-w-0 flex-col p-4 sm:p-6">
                <div className="space-y-5">
                    <div>
                        <h2 className="pr-8 text-xl font-semibold tracking-tight">{title}</h2>
                        {listing.location && (
                            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                                {listing.location}, Sri Lanka
                            </p>
                        )}
                    </div>

                    <section aria-label="Vehicle price" className="py-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cash price</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight">{listing.price}</p>
                    </section>

                    <dl className="grid grid-cols-2 gap-x-3">
                        {specifications.map(({ label, value }) => (
                            <div key={label} className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
                                <dt className="shrink-0 text-[11px] text-muted-foreground">{label}</dt>
                                <dd className="min-w-0 truncate text-xs font-medium text-right">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-auto pt-5">
                    <a
                        href={`/listings/${listing.slug}`}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        View full details
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </div>
    );
}