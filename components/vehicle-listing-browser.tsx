"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { VehicleListing } from "@/components/examples/c-card-9";
import type { VehicleListingData } from "@/lib/vehicle-listing-types";

export function VehicleListingBrowser({ listings }: Readonly<{ listings: VehicleListingData[] }>) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const matchesSearch = (listing: VehicleListingData) =>
    [
      listing.title,
      listing.make,
      listing.location,
      listing.details?.model,
      listing.details?.trimEdition,
      listing.details?.yearOfManufacture,
      listing.mileage,
      listing.engine,
      listing.transmission,
      listing.fuel,
      listing.price,
    ].some((value) => value?.toLowerCase().includes(normalizedSearchTerm));
  const modelSuggestions = listings.filter(matchesSearch).slice(0, 6);
  const filteredListings = listings.filter(matchesSearch);

  function goToSearch(query: string) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsSearchFocused(false);
    setActiveSuggestion(-1);
  }

  useEffect(() => {
    if (isSearchFocused) {
      searchInputRef.current?.focus();
    }
  }, [isSearchFocused]);

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchFocused(true);
      }
    }

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  return (
    <main className="flex min-h-full w-full flex-1 flex-col items-center bg-white px-6 py-10 dark:bg-black sm:px-10 lg:px-16">
      <div className="w-full max-w-7xl">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Find your next drive
          </h1>

          <div className="flex w-full justify-center">
            {!isSearchFocused && (
              <button
                type="button"
                className="flex h-10 w-full max-w-md items-center rounded-lg border border-border bg-background px-3 text-left text-sm text-muted-foreground shadow-sm transition-all duration-200 hover:border-indigo-600 hover:shadow-md"
                onClick={() => setIsSearchFocused(true)}
              >
                <Search className="pointer-events-none mr-2 size-4 shrink-0" aria-hidden="true" />
                <span>Search by make and model</span>
              </button>
            )}

            {isSearchFocused && (
              <>
                <button
                  type="button"
                  aria-label="Close search"
                  className="fixed inset-0 z-40 cursor-default bg-black/35 backdrop-blur-[2px]"
                  onMouseDown={() => {
                    setIsSearchFocused(false);
                    setActiveSuggestion(-1);
                  }}
                />
                <form
                  className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 animate-in fade-in zoom-in-95 duration-200 sm:top-28"
                  onSubmit={(event) => {
                    event.preventDefault();
                    goToSearch(searchTerm);
                  }}
                >
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setActiveSuggestion(-1);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" && modelSuggestions.length > 0) {
                        event.preventDefault();
                        setActiveSuggestion((current) =>
                          current < modelSuggestions.length - 1 ? current + 1 : 0,
                        );
                      }
                      if (event.key === "ArrowUp" && modelSuggestions.length > 0) {
                        event.preventDefault();
                        setActiveSuggestion((current) =>
                          current > 0 ? current - 1 : modelSuggestions.length - 1,
                        );
                      }
                      if (event.key === "Enter" && activeSuggestion >= 0) {
                        event.preventDefault();
                        const listing = modelSuggestions[activeSuggestion];
                        goToSearch([listing.make, listing.details?.model, listing.details?.trimEdition]
                          .filter(Boolean)
                          .join(" "));
                      }
                      if (event.key === "Escape") {
                        setIsSearchFocused(false);
                        setActiveSuggestion(-1);
                      }
                    }}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={modelSuggestions.length > 0}
                    aria-controls="vehicle-model-suggestions"
                    aria-activedescendant={activeSuggestion >= 0 ? `vehicle-model-${activeSuggestion}` : undefined}
                    placeholder="Search by make and model"
                    aria-label="Search vehicle listings"
                    className="h-14 w-full rounded-lg border border-border bg-background pl-12 pr-4 text-base text-foreground shadow-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15"
                  />
                  {modelSuggestions.length > 0 && (
                    <div id="vehicle-model-suggestions" role="listbox" className="absolute z-10 mt-3 w-full overflow-hidden rounded-lg border border-border bg-background p-1 shadow-2xl">
                      {modelSuggestions.map((listing, index) => (
                        <button
                          key={listing.slug}
                          id={`vehicle-model-${index}`}
                          type="button"
                          role="option"
                          aria-label={[listing.make, listing.details?.model ?? listing.title, listing.details?.trimEdition]
                            .filter(Boolean)
                            .join(" ")}
                          aria-selected={activeSuggestion === index}
                          className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition-colors ${activeSuggestion === index ? "bg-indigo-50 text-indigo-700" : "text-foreground hover:bg-muted"}`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            goToSearch([listing.make, listing.details?.model, listing.details?.trimEdition]
                              .filter(Boolean)
                              .join(" "));
                          }}
                        >
                          <span className="flex min-w-0 flex-1 items-center gap-2">
                            <span className="min-w-0 truncate text-sm font-medium">
                              {[listing.make, listing.details?.model ?? listing.title]
                                .filter(Boolean)
                                .join(" ")}
                            </span>
                            {listing.details?.trimEdition && (
                              <span className="max-w-48 shrink-0 truncate rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {listing.details.trimEdition}
                              </span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((listing) => (
            <VehicleListing key={listing.slug} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No vehicles match your search.
          </p>
        )}
      </div>
    </main>
  );
}
