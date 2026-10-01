import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { VehicleGallery } from "@/components/vehicle-gallery";
import { VehicleListing } from "@/components/examples/c-card-9";
import { RelativePostedDate } from "@/components/relative-posted-date";
import {
    getRecommendedVehicleListings,
    getVehicleListingBySlug,
} from "@/lib/vehicle-listing-queries";

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    await connection();
    const { slug } = await params;
    const listing = await getVehicleListingBySlug(slug);

    if (!listing) notFound();

    const recommendedListings = await getRecommendedVehicleListings(listing.slug);

    const unknown = "Not provided by seller";
    const details = listing.details ?? {};
    const detailSections = [
        {
            title: "Vehicle Information",
            items: [
                { label: "Brand", value: listing.make },
                { label: "Model", value: details.model ?? unknown },
                { label: "Trim / Edition", value: details.trimEdition ?? unknown },
                { label: "Body Type", value: details.bodyType ?? unknown },
                { label: "Year Of Manufacture", value: details.yearOfManufacture ?? unknown },
                { label: "Year Of Registration", value: details.yearOfRegistration ?? unknown },
                { label: "Mileage", value: listing.mileage },
            ],
        },
        {
            title: "Engine & Performance",
            items: [
                { label: "Fuel Type", value: listing.fuel },
                { label: "Transmission Type", value: listing.transmission },
                { label: "Engine Capacity (CC)", value: listing.engine },
                { label: "Fuel Efficiency", value: details.fuelEfficiency ?? unknown },
                { label: "Drive Type", value: details.driveType ?? unknown },
            ],
        },
        {
            title: "Features: Exterior",
            items: [
                { label: "Color", value: details.color ?? unknown },
                { label: "Wheels", value: details.wheels ?? unknown },
                { label: "Body Condition", value: details.bodyCondition ?? unknown },
                { label: "Tyre Condition", value: details.tyreCondition ?? unknown },
                { label: "Number Of Doors", value: details.numberOfDoors ?? unknown },
                { label: "Headlights", value: details.headlights ?? unknown },
                { label: "Additional Exterior Features", value: details.additionalExteriorFeatures ?? unknown },
            ],
        },
        {
            title: "Features: Interior",
            items: [
                { label: "Upholstery Material", value: details.upholsteryMaterial ?? unknown },
                { label: "Seat Condition", value: details.seatCondition ?? unknown },
                { label: "Interior Color", value: details.interiorColor ?? unknown },
                { label: "Air Conditioning", value: details.airConditioning ?? unknown },
                { label: "Seating Capacity", value: details.seatingCapacity ?? unknown },
                { label: "Additional Interior Features", value: details.additionalInteriorFeatures ?? unknown },
                { label: "Infotainment System", value: details.infotainmentSystem ?? unknown },
            ],
        },
        {
            title: "Safety and Security",
            items: [
                { label: "Airbag", value: details.airbag ?? unknown },
                { label: "Parking Sensors", value: details.parkingSensors ?? unknown },
                { label: "Anti-Lock Braking System (ABS)", value: details.abs ?? unknown },
                { label: "Traction Control", value: details.tractionControl ?? unknown },
                { label: "Security System", value: details.securitySystem ?? unknown },
                { label: "Other Safety Features", value: details.otherSafetyFeatures ?? unknown },
            ],
        },
        {
            title: "Ownership & Documentation",
            items: [
                { label: "Number Of Previous Owners", value: details.previousOwners ?? unknown },
                { label: "Service History Availability", value: details.serviceHistory ?? unknown },
                { label: "Insurance", value: details.insurance ?? unknown },
                { label: "Road Tax Paid Until", value: details.roadTaxPaidUntil ?? unknown },
                { label: "Emission Test Status", value: details.emissionTestStatus ?? unknown },
                { label: "Available Documentation", value: details.availableDocumentation ?? unknown },
            ],
        },
    ];

    return (
        <main className="w-full flex-1 bg-white px-5 py-7 text-foreground dark:bg-black sm:px-8 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to listings
                </Link>

                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {[listing.make, details.model, details.yearOfManufacture, details.trimEdition]
                                    .filter(Boolean)
                                    .join(" ")}
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Posted <RelativePostedDate date={details.posted ?? "Date unavailable"} />
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Used vehicle</span>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] lg:items-start">
                    <div className="lg:col-start-1 lg:row-start-1">
                        <VehicleGallery listing={listing} />
                    </div>

                    <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1">
                        <section className="rounded-xl bg-muted/45 p-5 sm:p-6">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cash price</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight">{listing.price}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Asking price · Sri Lankan rupees</p>

                            <div className="my-5 border-t border-border" />

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-medium">{listing.location}, Sri Lanka</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Seller-listed location</p>
                                </div>
                            </div>

                            {listing.listingUrl ? (
                                <a
                                    href={listing.listingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                                >
                                    Contact seller
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </a>
                            ) : (
                                <p className="mt-6 rounded-lg bg-background px-3 py-2 text-center text-sm text-muted-foreground">
                                    Seller contact is not available for this listing.
                                </p>
                            )}

                            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                                <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                                Confirm the vehicle documents, condition, and asking price with the seller before purchase.
                            </p>
                        </section>
                    </aside>

                    <div className="space-y-8 lg:col-start-1 lg:row-start-2">
                        {detailSections.map((section) => (
                            <section key={section.title} aria-labelledby={`detail-${section.title}`}>
                                <h2 id={`detail-${section.title}`} className="mb-3 text-base font-semibold">{section.title}</h2>
                                <dl className="grid grid-cols-2 border-t border-border sm:grid-cols-3">
                                    {section.items.map((item) => (
                                        <div key={item.label} className="min-w-0 border-b border-border py-3 pr-3">
                                            <dt className="text-xs text-muted-foreground">{item.label}</dt>
                                            <dd className="mt-1 wrap-break-word text-sm font-medium">{item.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                        ))}

                        <section aria-labelledby="vehicle-description-heading">
                            <h2 id="vehicle-description-heading" className="mb-3 text-base font-semibold">Description</h2>
                            <p className="border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
                                {details.description ?? "No seller description is available in this preview. Open the original listing for the seller's full description."}
                            </p>
                        </section>
                    </div>
                </div>

                <section className="mt-12" aria-labelledby="recommended-vehicles-heading">
                    <div className="mb-5">
                        <h2 id="recommended-vehicles-heading" className="text-xl font-semibold tracking-tight">
                            Recommended vehicles
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Explore other vehicles you might like.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {recommendedListings.map((recommended) => (
                            <VehicleListing key={recommended.slug} listing={recommended} compact />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
