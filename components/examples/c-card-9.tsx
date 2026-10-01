"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Bookmark } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { VehicleListingData } from "@/lib/vehicle-listing-types"

export function VehicleListing({
  listing,
  compact = false,
}: Readonly<{
  readonly listing: VehicleListingData
  readonly compact?: boolean
}>) {
  const listingImages = listing.images
  const [activeImage, setActiveImage] = useState(0)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!isImageHovered || listingImages.length < 2) return

    const carouselTimer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % listingImages.length)
    }, 1800)

    return () => window.clearInterval(carouselTimer)
  }, [isImageHovered, listingImages.length])

  return (
    <Card className={`w-full ${compact ? "max-w-xs" : "max-w-sm"} gap-0 overflow-hidden rounded-xl p-0 shadow-sm`}>
      <CardContent className="p-0">
        <div
          className={`relative ${compact ? "h-40" : "h-60"} w-full overflow-hidden bg-muted`}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {listingImages.length > 0 ? (
            <>
              <Link href={`/listings/${listing.slug}`} className="block size-full">
                <img
                  src={listingImages[activeImage].src}
                  alt={listingImages[activeImage].alt}
                  width={1000}
                  height={750}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              </Link>

              {listingImages.length > 1 && (
                <div
                  className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1"
                  role="tablist"
                  aria-label="Listing images"
                >
                  {listingImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      role="tab"
                      aria-selected={activeImage === index}
                      aria-label={`Show image ${index + 1}`}
                      className={`size-1.5 rounded-full transition-all ${activeImage === index ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={`/listings/${listing.slug}`}
              className="flex h-full items-center justify-center text-sm text-muted-foreground"
            >
              No photos available
            </Link>
          )}
        </div>

        <Link href={`/listings/${listing.slug}`} className={`flex flex-col text-inherit ${compact ? "gap-3 p-4" : "gap-5 p-5"}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight">{listing.title}</h2>
              {listing.details?.trimEdition && (
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {listing.details.trimEdition}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground">
              {listing.location
                ? `${listing.make} · ${listing.location}`
                : listing.make}
            </p>
          </div>

          <div className="-my-2 flex w-full flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] text-muted-foreground scrollbar-none [&::-webkit-scrollbar]:hidden">
            <span>{listing.mileage}</span>
            <span aria-hidden="true">•</span>
            <span>{listing.engine}</span>
            <span aria-hidden="true">•</span>
            <span>{listing.transmission}</span>
            <span aria-hidden="true">•</span>
            <span>{listing.fuel}</span>
          </div>

          <div>
            <p className="text-xs text-foreground">Cash</p>
            <p className="mt-1 text-sm font-bold">{listing.price}</p>
          </div>
        </Link>

        <div className={`flex items-center gap-2 ${compact ? "px-4 pb-4" : "px-5 pb-5"}`}>
          <a
            className={`inline-flex ${compact ? "h-8 w-full px-2.5 text-[11px]" : "h-9 flex-1 px-3 text-xs"} items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white transition-colors hover:bg-indigo-700`}
            href={`/listings/${listing.slug}`}
          >
            View deal details
          </a>
          {!compact && (
            <Button
              variant="outline"
              size="icon"
              className={`size-9 shrink-0 ${isSaved ? "border-indigo-600 text-indigo-600" : ""}`}
              aria-label={isSaved ? "Remove saved vehicle listing" : "Save vehicle listing"}
              aria-pressed={isSaved}
              onClick={() => setIsSaved((saved) => !saved)}
            >
              <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
