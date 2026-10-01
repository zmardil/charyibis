import { connection } from "next/server";

import { VehicleListingBrowser } from "@/components/vehicle-listing-browser";
import { getVehicleListings } from "@/lib/vehicle-listing-queries";

export default async function Home() {
  await connection();
  const listings = await getVehicleListings();

  return <VehicleListingBrowser listings={listings} />;
}
