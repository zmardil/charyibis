"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { VehicleListingData } from "@/lib/vehicle-listing-types";

export function VehicleGallery({
    listing,
    bleed = false,
}: Readonly<{ listing: VehicleListingData; bleed?: boolean }>) {
    const [activeImage, setActiveImage] = useState(0);
    const selectedImage = listing.images[activeImage];

    function showPrevious() {
        setActiveImage((index) => (index === 0 ? listing.images.length - 1 : index - 1));
    }

    function showNext() {
        setActiveImage((index) => (index + 1) % listing.images.length);
    }

    return (
        <section
            aria-label={`${listing.title} photos`}
            className={bleed ? "space-y-3 bg-popover" : "space-y-3 rounded-lg p-2"}
        >
            <div className={`relative aspect-4/3 overflow-hidden ${bleed ? "bg-popover rounded-none" : "bg-transparent rounded-lg"} sm:aspect-16/10`}>
                {selectedImage ? (
                    <img
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        className="size-full object-cover"
                        width={1200}
                        height={800}
                        fetchPriority="high"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                        No photos available
                    </div>
                )}
                {listing.images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={showPrevious}
                            aria-label="Previous vehicle photo"
                            className="absolute left-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
                        >
                            <ChevronLeft className="size-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={showNext}
                            aria-label="Next vehicle photo"
                            className="absolute right-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
                        >
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </button>
                        <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
                            {activeImage + 1} / {listing.images.length}
                        </span>
                    </>
                )}
            </div>

            {listing.images.length > 1 && (
                <div className={`grid grid-cols-4 gap-3 ${bleed ? "mx-3 mb-3" : ""}`} role="group" aria-label="Choose vehicle photo">
                    {listing.images.map((image, index) => (
                        <button
                            key={image.src}
                            type="button"
                            onClick={() => setActiveImage(index)}
                            aria-label={`Show photo ${index + 1}`}
                            aria-pressed={activeImage === index}
                            className={`aspect-4/3 overflow-hidden rounded-md ${bleed ? "bg-popover" : "bg-muted"} ring-offset-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${activeImage === index ? "ring-2 ring-indigo-600" : "opacity-75 hover:opacity-100"}`}
                        >
                            <img src={image.src} alt="" className="size-full object-cover" width={240} height={180} />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
