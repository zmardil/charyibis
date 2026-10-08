export type VehicleSuggestion = {
  make: string;
  model?: string;
  trim?: string;
  label: string;
};

export type VehicleListingData = {
  slug: string;
  title: string;
  make: string;
  location?: string;
  listingUrl?: string;
  mileage: string;
  engine: string;
  transmission: string;
  fuel: string;
  price: string;
  details?: Record<string, string>;
  images: {
    src: string;
    alt: string;
  }[];
};
