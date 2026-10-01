import { connection } from "next/server";

import { VehicleSearchResults } from "@/components/vehicle-search-results";
import { getVehicleListings } from "@/lib/vehicle-listing-queries";

export default async function SearchPage({
    searchParams,
}: {
    readonly searchParams: Promise<{ q?: string | string[] }>;
}) {
    await connection();
    const [{ q }, listings] = await Promise.all([searchParams, getVehicleListings()]);
    const query = Array.isArray(q) ? q[0] ?? "" : q ?? "";

    return <VehicleSearchResults listings={listings} query={query} />;
}