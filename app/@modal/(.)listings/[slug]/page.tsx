import { notFound } from "next/navigation";
import { connection } from "next/server";

import { ListingQuickViewDialog } from "@/components/listing-quick-view-dialog";
import { VehicleListingQuickView } from "@/components/vehicle-listing-quick-view";
import { getVehicleListingBySlug } from "@/lib/vehicle-listing-queries";

export default async function InterceptedVehicleListingPage({
  params,
}: Readonly<{
  readonly params: Promise<{ slug: string }>;
}>) {
  await connection();
  const { slug } = await params;
  const listing = await getVehicleListingBySlug(slug);

  if (!listing) notFound();

  return (
    <ListingQuickViewDialog>
      <VehicleListingQuickView listing={listing} />
    </ListingQuickViewDialog>
  );
}