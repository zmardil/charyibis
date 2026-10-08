"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { VehicleListing } from "@/components/examples/c-card-9";
import { Badge } from "@/components/reui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import type { VehicleListingData, VehicleSuggestion } from "@/lib/vehicle-listing-types";

export function VehicleListingBrowser({ listings }: Readonly<{ listings: VehicleListingData[] }>) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const searchWords = normalizedSearchTerm.split(/\s+/).filter(Boolean);
  const matchesSearch = (listing: VehicleListingData) => {
    if (searchWords.length === 0) return true;
    const fields = [
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
    ].map((value) => value?.toLowerCase());
    return searchWords.every((word) => fields.some((field) => field?.includes(word)));
  };
  const filteredListings = listings.filter(matchesSearch);

  const suggestions = useMemo<VehicleSuggestion[]>(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    const words = term.split(/\s+/);
    const seen = new Set<string>();
    const matches: VehicleSuggestion[] = [];
    for (const listing of listings) {
      const make = listing.make.trim();
      const model = listing.details?.model?.trim();
      const trim = listing.details?.trimEdition?.trim();
      const label = [make, model, trim].filter(Boolean).join(" ");
      if (!label || seen.has(label)) continue;
      if (words.some((word) => !label.toLowerCase().includes(word))) continue;
      seen.add(label);
      matches.push({ make, model, trim, label });
    }
    return matches.sort((a, b) => a.label.localeCompare(b.label)).slice(0, 5);
  }, [listings, searchTerm]);
  const suggestionsOpen = showSuggestions && suggestions.length > 0;

  function goToSearch(query: string) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  function handleSelectSuggestion(value: string) {
    setSearchTerm(value);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
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
            <Command
              shouldFilter={false}
              vimBindings={false}
              className="relative w-full max-w-md overflow-visible bg-transparent p-0"
            >
              <form
                className="flex h-11 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background px-3 shadow-sm transition-colors focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/15"
                onSubmit={(event) => {
                  event.preventDefault();
                  goToSearch(searchTerm);
                }}
              >
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setShowSuggestions(false)}
                  onKeyDown={(event) => {
                    if (
                      !suggestionsOpen &&
                      ["ArrowDown", "ArrowUp", "End", "Home", "Enter"].includes(event.key)
                    ) {
                      event.stopPropagation();
                    }
                    if (event.key === "Escape") {
                      if (suggestionsOpen) {
                        event.preventDefault();
                        setShowSuggestions(false);
                      } else {
                        event.currentTarget.blur();
                      }
                    }
                  }}
                  placeholder="Search by make and model"
                  aria-label="Search vehicle listings"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {searchTerm ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setSearchTerm("")}
                    className="text-muted-foreground"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                ) : null}
              </form>
              {suggestionsOpen && (
                <div
                  className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <CommandList>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.label}
                        value={suggestion.label}
                        onSelect={handleSelectSuggestion}
                      >
                        <span className="truncate">
                          {[suggestion.make, suggestion.model].filter(Boolean).join(" ")}
                        </span>
                        {suggestion.trim ? (
                          <Badge variant="secondary" radius="full">
                            {suggestion.trim}
                          </Badge>
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandList>
                </div>
              )}
            </Command>
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
