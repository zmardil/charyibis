"use client";

import { useState } from "react";

import { VehicleListing } from "@/components/examples/c-card-9";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { VehicleListingData } from "@/lib/vehicle-listing-types";

type FilterKey = "color" | "yearOfManufacture" | "fuel" | "transmission";

const filters: { key: FilterKey; label: string }[] = [
    { key: "color", label: "Color" },
    { key: "yearOfManufacture", label: "Year" },
    { key: "fuel", label: "Fuel type" },
    { key: "transmission", label: "Transmission" },
];

function getFilterValue(listing: VehicleListingData, key: FilterKey) {
    return key === "fuel" || key === "transmission"
        ? listing[key]
        : listing.details?.[key];
}

export function VehicleSearchResults({
    listings,
    query,
}: {
    readonly listings: VehicleListingData[];
    readonly query: string;
}) {
    const [selectedFilters, setSelectedFilters] = useState<Record<FilterKey, string[]>>({
        color: [],
        yearOfManufacture: [],
        fuel: [],
        transmission: [],
    });
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const normalizedQuery = query.trim().toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    const matchingListings = listings.filter((listing) => {
        const searchableIdentity = [
            listing.title,
            listing.make,
            listing.details?.model,
            listing.details?.trimEdition,
        ].filter(Boolean).join(" ").toLowerCase();
        const matchesQuery = queryTerms.every((term) => searchableIdentity.includes(term));
        const matchesFilters = filters.every(({ key }) => {
            const selected = selectedFilters[key];
            return selected.length === 0 || selected.includes(getFilterValue(listing, key) ?? "");
        });
        const matchesLocation = !selectedLocation || listing.location === selectedLocation;

        return matchesQuery && matchesFilters && matchesLocation;
    });
    const locations = [...new Set(listings
        .map((listing) => listing.location)
        .filter((location): location is string => Boolean(location)))].sort((a, b) => a.localeCompare(b));

    function toggleFilter(key: FilterKey, value: string) {
        setSelectedFilters((current) => {
            const selected = current[key];
            return {
                ...current,
                [key]: selected.includes(value)
                    ? selected.filter((item) => item !== value)
                    : [...selected, value],
            };
        });
    }

    return (
        <main className="w-full flex-1 bg-white px-5 py-8 text-foreground dark:bg-black sm:px-8 sm:py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-7 border-b border-border pb-5">
                    <p className="text-sm text-muted-foreground">Search results</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Showing results for {query.trim() ? `“${query.trim()}”` : "all vehicles"}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {matchingListings.length} {matchingListings.length === 1 ? "vehicle" : "vehicles"} found
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <aside aria-label="Search filters" className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h2 className="text-base font-semibold">Filters</h2>
                            <button
                                type="button"
                                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                onClick={() => {
                                    setSelectedFilters({ color: [], yearOfManufacture: [], fuel: [], transmission: [] });
                                    setSelectedLocation(null);
                                }}
                            >
                                Clear all
                            </button>
                        </div>
                        {locations.length > 0 && (
                            <fieldset className="space-y-3">
                                <legend className="text-sm font-medium">Location</legend>
                                <Select
                                    value={selectedLocation}
                                    onValueChange={(value) => setSelectedLocation(value)}
                                >
                                    <SelectTrigger size="sm" className="w-full">
                                        <SelectValue placeholder="All locations" />
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        {locations.map((location) => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </fieldset>
                        )}
                        {filters.map(({ key, label }) => {
                            const values = [...new Set(listings
                                .map((listing) => getFilterValue(listing, key))
                                .filter((value): value is string => Boolean(value)))].sort((a, b) =>
                                    key === "yearOfManufacture" ? b.localeCompare(a, undefined, { numeric: true }) : a.localeCompare(b),
                                );

                            if (values.length === 0) return null;

                            return (
                                <fieldset key={key} className="space-y-3">
                                    <legend className="text-sm font-medium">{label}</legend>
                                    <div className="space-y-2">
                                        {values.map((value) => (
                                            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                                <Checkbox
                                                    checked={selectedFilters[key].includes(value)}
                                                    onCheckedChange={() => toggleFilter(key, value)}
                                                />
                                                <span>{value}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            );
                        })}
                    </aside>

                    <section aria-label="Matching vehicles">
                        {matchingListings.length > 0 ? (
                            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {matchingListings.map((listing) => (
                                    <VehicleListing key={listing.slug} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <p className="py-16 text-center text-sm text-muted-foreground">
                                No vehicles match this search and its filters.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}