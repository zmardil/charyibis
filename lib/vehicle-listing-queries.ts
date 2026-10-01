import "server-only";

import type { VehicleListing as DatabaseVehicleListing } from "../generated/prisma/client";
import { prisma } from "./prisma";
import type { VehicleListingData } from "./vehicle-listing-types";

function readDetails(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return undefined;

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

function readImages(value: unknown): VehicleListingData["images"] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((image) => {
    if (!image || typeof image !== "object" || Array.isArray(image)) return [];

    const { src, alt } = image as Record<string, unknown>;
    return typeof src === "string" && typeof alt === "string"
      ? [{ src, alt }]
      : [];
  });
}

function toVehicleListingData(
  listing: DatabaseVehicleListing,
): VehicleListingData {
  return {
    slug: listing.slug,
    title: listing.title,
    make: listing.make,
    location: listing.location ?? undefined,
    listingUrl: listing.listingUrl ?? undefined,
    mileage: listing.mileage,
    engine: listing.engine,
    transmission: listing.transmission,
    fuel: listing.fuel,
    price: listing.price,
    details: readDetails(listing.details),
    images: readImages(listing.images),
  };
}

export async function getVehicleListings() {
  const listings = await prisma.vehicleListing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return listings.map(toVehicleListingData);
}

export async function getVehicleListingBySlug(slug: string) {
  const listing = await prisma.vehicleListing.findUnique({ where: { slug } });
  return listing ? toVehicleListingData(listing) : null;
}

export async function getRecommendedVehicleListings(slug: string, take = 3) {
  const listings = await prisma.vehicleListing.findMany({
    where: { slug: { not: slug } },
    orderBy: { createdAt: "desc" },
    take,
  });

  return listings.map(toVehicleListingData);
}

export async function getFavoriteVehicleSlugs(userId: string) {
  const favorites = await prisma.vehicleFavorite.findMany({
    where: { userId },
    select: { listingSlug: true },
  });

  return favorites.map(({ listingSlug }) => listingSlug);
}

export async function getFavoriteVehicleListings(userId: string) {
  const favorites = await prisma.vehicleFavorite.findMany({
    where: { userId },
    include: { listing: true },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map(({ listing }) => toVehicleListingData(listing));
}
