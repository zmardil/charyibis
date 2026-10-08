import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Deterministic pseudo-random generator (mulberry32) so repeated seed runs
 * produce the same randomized listing attributes.
 */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(20260929);

function pick<T>(options: readonly T[]): T {
  return options[Math.floor(random() * options.length)];
}

function pickStep(min: number, max: number, step: number): number {
  const steps = Math.floor((max - min) / step) + 1;
  return min + Math.floor(random() * steps) * step;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const COMMONS_THUMB_BASE = "https://upload.wikimedia.org/wikipedia/commons/thumb";

function commonsImage(path: string): string {
  const fileName = path.split("/").pop();
  return `${COMMONS_THUMB_BASE}/${path}/960px-${fileName}`;
}

type ListingImage = { alt: string; src: string };

type ListingSeed = {
  slug: string;
  title: string;
  make: string;
  location: string;
  listingUrl: string;
  mileage: string;
  engine: string;
  transmission: string;
  fuel: string;
  price: string;
  details: Record<string, string>;
  images: ListingImage[];
};

const EXISTING_LISTINGS: ListingSeed[] = [
  {
    slug: "toyota-prius-2016-pannipitiya",
    title: "Prius 2016",
    make: "Toyota",
    location: "Pannipitiya",
    listingUrl: "https://ikman.lk/en/ad/toyota-prius-2016-for-sale-colombo-404",
    mileage: "110,000 km",
    engine: "1,800 cc",
    transmission: "Automatic",
    fuel: "Petrol",
    price: "Rs. 10,450,000",
    details: {
      abs: "Yes",
      color: "Pearl white",
      model: "Prius",
      airbag: "Front and side airbags",
      posted: "2026-09-29",
      wheels: "17-inch alloy wheels",
      bodyType: "Liftback",
      driveType: "Front-wheel drive",
      insurance: "Third-party cover",
      headlights: "LED headlights",
      description: "2016 Toyota Prius hybrid with a comfortable interior and useful features.",
      trimEdition: "S Touring Selection",
      bodyCondition: "Good",
      interiorColor: "Black",
      numberOfDoors: "5",
      seatCondition: "Good",
      tyreCondition: "Good",
      fuelEfficiency: "22 km/L (estimated value)",
      parkingSensors: "Rear sensors",
      previousOwners: "2",
      securitySystem: "Immobilizer",
      serviceHistory: "Partial records",
      airConditioning: "Automatic climate control",
      seatingCapacity: "5",
      tractionControl: "Yes",
      roadTaxPaidUntil: "31 Dec 2026",
      yearOfManufacture: "2016",
      emissionTestStatus: "Valid through 2026",
      infotainmentSystem: "Touchscreen audio with Bluetooth",
      upholsteryMaterial: "Fabric",
      yearOfRegistration: "2016",
      otherSafetyFeatures: "Rear-view camera",
      availableDocumentation: "Registration book and revenue licence",
      additionalExteriorFeatures: "Rear spoiler, power mirrors",
      additionalInteriorFeatures: "Power windows, keyless entry",
    },
    images: [
      {
        alt: "2016 Toyota Prius ZVW50 hybrid liftback",
        src: commonsImage("f/fa/2016_Toyota_Prius_%28ZVW50L%29_Hybrid_liftback_%282016-04-02%29_01.jpg"),
      },
      {
        alt: "2016 Toyota Prius ZVW50 hybrid liftback, second view",
        src: commonsImage("1/14/2016_Toyota_Prius_%28ZVW50L%29_Hybrid_liftback_%282016-04-02%29_02.jpg"),
      },
    ],
  },
  {
    slug: "toyota-aqua-2014-battaramulla",
    title: "Aqua 2014",
    make: "Toyota",
    location: "Battaramulla",
    listingUrl: "https://ikman.lk/en/ad/toyota-aqua-2014-for-sale-colombo-3474",
    mileage: "124,387 km",
    engine: "1,496 cc",
    transmission: "Automatic",
    fuel: "Hybrid",
    price: "Rs. 7,990,000",
    details: {
      abs: "Yes",
      color: "Super red",
      model: "Aqua",
      airbag: "Front airbags",
      posted: "2026-09-29",
      wheels: "15-inch alloy wheels",
      bodyType: "Hatchback",
      driveType: "Front-wheel drive",
      insurance: "Third-party cover",
      headlights: "Halogen headlights",
      description: "Compact Toyota Aqua hybrid with practical features for everyday driving.",
      trimEdition: "G Grade",
      bodyCondition: "Good",
      interiorColor: "Dark grey",
      numberOfDoors: "5",
      seatCondition: "Good",
      tyreCondition: "Good",
      fuelEfficiency: "25 km/L (estimated value)",
      parkingSensors: "Rear sensors",
      previousOwners: "2",
      securitySystem: "Immobilizer",
      serviceHistory: "Partial records",
      airConditioning: "Manual air conditioning",
      seatingCapacity: "5",
      tractionControl: "Yes",
      roadTaxPaidUntil: "31 Dec 2026",
      yearOfManufacture: "2014",
      emissionTestStatus: "Valid through 2026",
      infotainmentSystem: "Touchscreen audio with Bluetooth",
      upholsteryMaterial: "Fabric",
      yearOfRegistration: "2015",
      otherSafetyFeatures: "Reverse camera",
      availableDocumentation: "Registration book and revenue licence",
      additionalExteriorFeatures: "Power mirrors, rear spoiler",
      additionalInteriorFeatures: "Power windows, keyless entry",
    },
    images: [
      {
        alt: "Toyota Prius c NHP10, international counterpart to the Toyota Aqua",
        src: commonsImage("9/99/Toyota_Prius_c_IMG_7739.jpg"),
      },
      {
        alt: "Toyota Prius c NHP10 hatchback, alternate view",
        src: commonsImage("6/69/Toyota_Prius_c_NHP10_Super_Red_01.jpg"),
      },
    ],
  },
  {
    slug: "toyota-axio-2020-kottawa",
    title: "Axio 2020",
    make: "Toyota",
    location: "Kottawa",
    listingUrl: "https://ikman.lk/en/ad/toyota-axio-2020-for-sale-colombo-102",
    mileage: "138,100 km",
    engine: "1,500 cc",
    transmission: "Automatic",
    fuel: "Hybrid",
    price: "Rs. 12,275,000",
    details: {
      abs: "Yes",
      color: "Silver metallic",
      model: "Axio",
      airbag: "Front and side airbags",
      posted: "2026-09-29",
      wheels: "15-inch alloy wheels",
      bodyType: "Sedan",
      driveType: "Front-wheel drive",
      insurance: "Comprehensive cover",
      headlights: "LED headlights",
      description: "Toyota Corolla Axio hybrid sedan with efficient performance and a comfortable interior.",
      trimEdition: "G Hybrid",
      bodyCondition: "Good",
      interiorColor: "Black",
      numberOfDoors: "4",
      seatCondition: "Good",
      tyreCondition: "Good",
      fuelEfficiency: "24 km/L (estimated value)",
      parkingSensors: "Rear sensors",
      previousOwners: "1",
      securitySystem: "Immobilizer",
      serviceHistory: "Available",
      airConditioning: "Automatic climate control",
      seatingCapacity: "5",
      tractionControl: "Yes",
      roadTaxPaidUntil: "31 Dec 2026",
      yearOfManufacture: "2020",
      emissionTestStatus: "Valid through 2026",
      infotainmentSystem: "Touchscreen audio with Bluetooth",
      upholsteryMaterial: "Fabric",
      yearOfRegistration: "2020",
      otherSafetyFeatures: "Vehicle stability control",
      availableDocumentation: "Registration book and service records",
      additionalExteriorFeatures: "Power mirrors, rear spoiler",
      additionalInteriorFeatures: "Power windows, push-button start",
    },
    images: [
      {
        alt: "Toyota Corolla Axio E160 generation front view",
        src: commonsImage("4/42/Toyota_Corolla_Axio_%28E160%29_front.JPG"),
      },
      {
        alt: "Toyota Corolla Axio E160 generation, alternate view",
        src: commonsImage("7/78/Toyota_Corolla_Axio_%2850759567928%29.jpg"),
      },
    ],
  },
  {
    slug: "suzuki-wagon-r-2014-malabe",
    title: "Wagon R 2014",
    make: "Suzuki",
    location: "Malabe",
    listingUrl: "https://ikman.lk/en/ad/suzuki-wagon-r-2014-for-sale-colombo-1884",
    mileage: "85,000 km",
    engine: "650 cc",
    transmission: "Automatic",
    fuel: "Petrol",
    price: "Rs. 5,975,000",
    details: {
      abs: "Yes",
      color: "White",
      model: "Wagon R",
      airbag: "Front airbags",
      posted: "2026-09-29",
      wheels: "14-inch alloy wheels",
      bodyType: "Hatchback",
      driveType: "Front-wheel drive",
      insurance: "Third-party cover",
      headlights: "Halogen headlights",
      description: "Compact Suzuki Wagon R with practical features for everyday driving.",
      trimEdition: "FX Limited",
      bodyCondition: "Good",
      interiorColor: "Beige",
      numberOfDoors: "5",
      seatCondition: "Good",
      tyreCondition: "Good",
      fuelEfficiency: "20 km/L (estimated value)",
      parkingSensors: "Not installed",
      previousOwners: "2",
      securitySystem: "Immobilizer",
      serviceHistory: "Partial records",
      airConditioning: "Manual air conditioning",
      seatingCapacity: "4",
      tractionControl: "Not installed",
      roadTaxPaidUntil: "31 Dec 2026",
      yearOfManufacture: "2014",
      emissionTestStatus: "Valid through 2026",
      infotainmentSystem: "Bluetooth audio system",
      upholsteryMaterial: "Fabric",
      yearOfRegistration: "2015",
      otherSafetyFeatures: "Rear child safety locks",
      availableDocumentation: "Registration book and revenue licence",
      additionalExteriorFeatures: "Power mirrors, rear wiper",
      additionalInteriorFeatures: "Power windows, keyless entry",
    },
    images: [
      {
        alt: "2012-2014 Suzuki Wagon R FX Limited front view",
        src: commonsImage("a/a4/2012-2014_Suzuki_Wagon_R_FX_Limited.jpg"),
      },
      {
        alt: "2012-2014 Suzuki Wagon R FX Limited rear view",
        src: commonsImage("9/99/2012-2014_Suzuki_Wagon_R_FX_Limited_rear.jpg"),
      },
    ],
  },
];

const COLORS = [
  "Pearl white",
  "Silver metallic",
  "White",
  "Attitude black",
  "Grey metallic",
  "Super red",
  "Wine red",
  "Light blue metallic",
] as const;

const INTERIOR_COLORS = ["Black", "Dark grey", "Beige", "Ivory"] as const;

const AIRBAGS = ["Front airbags", "Front and side airbags"] as const;

const INSURANCE = ["Third-party cover", "Comprehensive cover"] as const;

const BODY_CONDITIONS = ["Excellent", "Good", "Good", "Fair"] as const;

const SEAT_CONDITIONS = ["Excellent", "Good"] as const;

const TYRE_CONDITIONS = ["Excellent", "Good", "Fair"] as const;

const PARKING_SENSORS = ["Rear sensors", "Front and rear sensors", "Not installed"] as const;

const PREVIOUS_OWNERS = ["1", "2", "3"] as const;

const SECURITY_SYSTEMS = ["Immobilizer", "Immobilizer and alarm"] as const;

const SERVICE_HISTORY = ["Available", "Partial records", "Not available"] as const;

const AIR_CONDITIONING = ["Automatic climate control", "Manual air conditioning"] as const;

const TRACTION_CONTROL = ["Yes", "Yes", "Not installed"] as const;

const INFOTAINMENT = ["Touchscreen audio with Bluetooth", "Bluetooth audio system"] as const;

const UPHOLSTERY = ["Fabric", "Half leather", "Genuine leather"] as const;

const OTHER_SAFETY = [
  "Rear-view camera",
  "Reverse camera",
  "Vehicle stability control",
  "Hill start assist",
  "Rear child safety locks",
] as const;

const DOCUMENTATION = [
  "Registration book and revenue licence",
  "Registration book and service records",
] as const;

const EXTERIOR_FEATURES = [
  "Power mirrors, rear spoiler",
  "Power mirrors, rear wiper",
  "Fog lamps, power mirrors",
  "Rear spoiler, power mirrors",
] as const;

const INTERIOR_FEATURES = [
  "Power windows, keyless entry",
  "Power windows, push-button start",
  "Cruise control, keyless entry",
] as const;

const POSTED_DATES = ["2026-09-27", "2026-09-28", "2026-09-29"] as const;

const LOCATIONS = [
  "Colombo",
  "Kandy",
  "Galle",
  "Negombo",
  "Dehiwala",
  "Nugegoda",
  "Maharagama",
  "Kelaniya",
  "Moratuwa",
  "Wattala",
  "Kurunegala",
  "Matara",
  "Kaduwela",
  "Rajagiriya",
  "Homagama",
  "Mount Lavinia",
] as const;

type VehicleSpec = {
  make: string;
  model: string;
  year: number;
  trim: string;
  engine: string;
  fuel: string;
  bodyType: string;
  driveType: string;
  doors: string;
  seats: string;
  wheels: string;
  headlights: string;
  fuelEfficiency: string;
  description: string;
  priceRange: [number, number];
  mileageRange: [number, number];
  images: ListingImage[];
};

// Popular vehicles in the Sri Lankan used-car market.
const NEW_VEHICLES: VehicleSpec[] = [
  {
    make: "Toyota",
    model: "Vitz",
    year: 2017,
    trim: "Hybrid F",
    engine: "1,500 cc",
    fuel: "Hybrid",
    bodyType: "Hatchback",
    driveType: "Front-wheel drive",
    doors: "5",
    seats: "5",
    wheels: "15-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "27 km/L (estimated value)",
    description: "Toyota Vitz hybrid hatchback with nimble handling and low fuel costs.",
    priceRange: [6_500_000, 7_500_000],
    mileageRange: [45_000, 110_000],
    images: [
      { alt: "2017 Toyota Vitz Hybrid F front view", src: commonsImage("5/5d/2017-2020_Toyota_Vitz_Hybrid_F.jpg") },
      { alt: "2017 Toyota Vitz Hybrid F rear view", src: commonsImage("2/20/2017-2020_Toyota_Vitz_Hybrid_F_rear.jpg") },
    ],
  },
  {
    make: "Toyota",
    model: "Allion",
    year: 2015,
    trim: "A15",
    engine: "1,500 cc",
    fuel: "Petrol",
    bodyType: "Sedan",
    driveType: "Front-wheel drive",
    doors: "4",
    seats: "5",
    wheels: "15-inch alloy wheels",
    headlights: "Halogen headlights",
    fuelEfficiency: "16 km/L (estimated value)",
    description: "Well-maintained Toyota Allion sedan with a spacious cabin and a smooth ride.",
    priceRange: [7_000_000, 8_000_000],
    mileageRange: [80_000, 140_000],
    images: [
      { alt: "Toyota Allion T260 sedan front view", src: commonsImage("f/fd/Toyota_Allion_IMG01.jpg") },
      { alt: "Toyota Allion T260 sedan, alternate view", src: commonsImage("0/09/Toyota_Allion_IMG02.jpg") },
    ],
  },
  {
    make: "Toyota",
    model: "Premio",
    year: 2016,
    trim: "F Grade L Package",
    engine: "1,500 cc",
    fuel: "Petrol",
    bodyType: "Sedan",
    driveType: "Front-wheel drive",
    doors: "4",
    seats: "5",
    wheels: "15-inch alloy wheels",
    headlights: "Halogen headlights",
    fuelEfficiency: "16 km/L (estimated value)",
    description: "Toyota Premio sedan in clean condition, popular for comfort and reliability.",
    priceRange: [9_000_000, 10_000_000],
    mileageRange: [60_000, 120_000],
    images: [
      { alt: "Toyota Premio T260 sedan front view", src: commonsImage("a/a8/TOYOTA_PREMIO_T260_20160704_01.jpeg") },
      { alt: "Toyota Premio T260 sedan, alternate view", src: commonsImage("8/8c/TOYOTA_PREMIO_T260_20160704_02.jpeg") },
    ],
  },
  {
    make: "Honda",
    model: "Fit",
    year: 2016,
    trim: "Hybrid F Package",
    engine: "1,500 cc",
    fuel: "Hybrid",
    bodyType: "Hatchback",
    driveType: "Front-wheel drive",
    doors: "5",
    seats: "5",
    wheels: "15-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "30 km/L (estimated value)",
    description: "Honda Fit hybrid with flexible seating and excellent fuel economy.",
    priceRange: [6_000_000, 6_800_000],
    mileageRange: [50_000, 110_000],
    images: [
      { alt: "2016 Honda Fit Hybrid front view", src: commonsImage("f/f1/2015-2017_Honda_Fit_Hybrid.jpg") },
      { alt: "2016 Honda Fit Hybrid F Package, alternate view", src: commonsImage("b/b7/2015-2017_Honda_Fit_Hybrid_F_Package.jpg") },
    ],
  },
  {
    make: "Honda",
    model: "Grace",
    year: 2016,
    trim: "Hybrid LX",
    engine: "1,500 cc",
    fuel: "Hybrid",
    bodyType: "Sedan",
    driveType: "Front-wheel drive",
    doors: "4",
    seats: "5",
    wheels: "15-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "32 km/L (estimated value)",
    description: "Honda Grace hybrid sedan with a refined interior and low running costs.",
    priceRange: [6_200_000, 7_000_000],
    mileageRange: [50_000, 110_000],
    images: [
      { alt: "Honda Grace LX sedan front view", src: commonsImage("b/be/Honda_GRACE_LX_%28DBA-GM6%29_front.jpg") },
      { alt: "Honda Grace LX sedan rear view", src: commonsImage("b/b8/Honda_GRACE_LX_%28DBA-GM6%29_rear.jpg") },
    ],
  },
  {
    make: "Honda",
    model: "Vezel",
    year: 2015,
    trim: "Hybrid X",
    engine: "1,500 cc",
    fuel: "Hybrid",
    bodyType: "SUV",
    driveType: "Front-wheel drive",
    doors: "5",
    seats: "5",
    wheels: "17-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "25 km/L (estimated value)",
    description: "Honda Vezel hybrid SUV with a practical boot and modern features.",
    priceRange: [7_500_000, 8_500_000],
    mileageRange: [55_000, 120_000],
    images: [
      { alt: "Honda Vezel Hybrid X front view", src: commonsImage("9/9f/Honda_VEZEL_HYBRID_X_%28RU3%29_front.JPG") },
      { alt: "2015 Honda Vezel 1.5 X, alternate view", src: commonsImage("0/04/2015_Honda_Vezel_%28MY15%29_1.5X_5-door_wagon_%282016-01-05%29.jpg") },
    ],
  },
  {
    make: "Suzuki",
    model: "Swift",
    year: 2018,
    trim: "Boosterjet SHVS",
    engine: "1,000 cc",
    fuel: "Petrol",
    bodyType: "Hatchback",
    driveType: "Front-wheel drive",
    doors: "5",
    seats: "5",
    wheels: "16-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "20 km/L (estimated value)",
    description: "Suzuki Swift with the turbocharged Boosterjet engine and sporty handling.",
    priceRange: [5_500_000, 6_200_000],
    mileageRange: [30_000, 85_000],
    images: [
      { alt: "2018 Suzuki Swift Boosterjet SHVS front view", src: commonsImage("9/9a/2018_Suzuki_Swift_SZ5_Boosterjet_SHVS_1.0_Front.jpg") },
      { alt: "2018 Suzuki Swift Boosterjet SHVS rear view", src: commonsImage("1/1e/2018_Suzuki_Swift_SZ5_Boosterjet_SHVS_1.0_Rear.jpg") },
    ],
  },
  {
    make: "Suzuki",
    model: "Alto",
    year: 2017,
    trim: "F",
    engine: "660 cc",
    fuel: "Petrol",
    bodyType: "Hatchback",
    driveType: "Front-wheel drive",
    doors: "5",
    seats: "4",
    wheels: "14-inch alloy wheels",
    headlights: "Halogen headlights",
    fuelEfficiency: "24 km/L (estimated value)",
    description: "Compact Suzuki Alto kei car, ideal for city driving and tight budgets.",
    priceRange: [3_200_000, 3_800_000],
    mileageRange: [35_000, 90_000],
    images: [
      { alt: "Suzuki Alto HA37S front view", src: commonsImage("0/05/Suzuki_Alto_HA37S_A.jpg") },
      { alt: "Suzuki Alto HA37S rear view", src: commonsImage("c/cc/Suzuki_Alto_HA37S_A_rear.jpg") },
    ],
  },
  {
    make: "Nissan",
    model: "Leaf",
    year: 2017,
    trim: "G",
    engine: "Electric motor",
    fuel: "Electric",
    bodyType: "Hatchback",
    driveType: "Front-wheel drive",
    doors: "5",
    seats: "5",
    wheels: "16-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "150 km per charge (estimated value)",
    description: "Nissan Leaf electric hatchback with zero tailpipe emissions and low running costs.",
    priceRange: [5_500_000, 6_500_000],
    mileageRange: [40_000, 95_000],
    images: [
      { alt: "2017 Nissan Leaf hatchback front view", src: commonsImage("6/62/2017_Nissan_LEAF_%28ZE0_MY17%29_hatchback_%282018-11-02%29_01.jpg") },
      { alt: "2017 Nissan Leaf hatchback, alternate view", src: commonsImage("a/a5/2017_Nissan_LEAF_%28ZE0_MY17%29_hatchback_%282018-11-02%29_02.jpg") },
    ],
  },
  {
    make: "Mitsubishi",
    model: "Outlander",
    year: 2018,
    trim: "G Premium Package",
    engine: "2,400 cc",
    fuel: "Hybrid",
    bodyType: "SUV",
    driveType: "All-wheel drive",
    doors: "5",
    seats: "5",
    wheels: "18-inch alloy wheels",
    headlights: "LED headlights",
    fuelEfficiency: "18 km/L (estimated value)",
    description: "Mitsubishi Outlander PHEV plug-in hybrid SUV with all-wheel drive capability.",
    priceRange: [12_000_000, 13_500_000],
    mileageRange: [45_000, 100_000],
    images: [
      { alt: "Mitsubishi Outlander PHEV front view", src: commonsImage("0/09/2016_Mitsubishi_Outlander_GX_4H_PHEV_S-A_2.0.jpg") },
      { alt: "Mitsubishi Outlander PHEV, alternate view", src: commonsImage("7/75/Mitsubishi_Outlander_PHEV_%28MSP16%29.jpg") },
    ],
  },
];

function buildListing(spec: VehicleSpec, location: string): ListingSeed {
  const slug = `${spec.make} ${spec.model} ${spec.year} ${location}`
    .toLowerCase()
    .replace(/\s+/g, "-");
  const adSlug = `${spec.make} ${spec.model} ${spec.year}`
    .toLowerCase()
    .replace(/\s+/g, "-");
  const price = pickStep(spec.priceRange[0], spec.priceRange[1], 25_000);
  const mileage = pickStep(spec.mileageRange[0], spec.mileageRange[1], 100);

  return {
    slug,
    title: `${spec.model} ${spec.year}`,
    make: spec.make,
    location,
    listingUrl: `https://ikman.lk/en/ad/${adSlug}-for-sale-colombo-${pickStep(100, 4999, 1)}`,
    mileage: `${formatNumber(mileage)} km`,
    engine: spec.engine,
    transmission: "Automatic",
    fuel: spec.fuel,
    price: `Rs. ${formatNumber(price)}`,
    details: {
      abs: "Yes",
      color: pick(COLORS),
      model: spec.model,
      airbag: pick(AIRBAGS),
      posted: pick(POSTED_DATES),
      wheels: spec.wheels,
      bodyType: spec.bodyType,
      driveType: spec.driveType,
      insurance: pick(INSURANCE),
      headlights: spec.headlights,
      description: spec.description,
      trimEdition: spec.trim,
      bodyCondition: pick(BODY_CONDITIONS),
      interiorColor: pick(INTERIOR_COLORS),
      numberOfDoors: spec.doors,
      seatCondition: pick(SEAT_CONDITIONS),
      tyreCondition: pick(TYRE_CONDITIONS),
      fuelEfficiency: spec.fuelEfficiency,
      parkingSensors: pick(PARKING_SENSORS),
      previousOwners: pick(PREVIOUS_OWNERS),
      securitySystem: pick(SECURITY_SYSTEMS),
      serviceHistory: pick(SERVICE_HISTORY),
      airConditioning: pick(AIR_CONDITIONING),
      seatingCapacity: spec.seats,
      tractionControl: pick(TRACTION_CONTROL),
      roadTaxPaidUntil: "31 Dec 2026",
      yearOfManufacture: String(spec.year),
      emissionTestStatus:
        spec.fuel === "Electric"
          ? "Not applicable for electric vehicles"
          : "Valid through 2026",
      infotainmentSystem: pick(INFOTAINMENT),
      upholsteryMaterial: pick(UPHOLSTERY),
      yearOfRegistration: String(pick([spec.year, spec.year + 1] as const)),
      otherSafetyFeatures: pick(OTHER_SAFETY),
      availableDocumentation: pick(DOCUMENTATION),
      additionalExteriorFeatures: pick(EXTERIOR_FEATURES),
      additionalInteriorFeatures: pick(INTERIOR_FEATURES),
    },
    images: spec.images,
  };
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL for Prisma.");
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const locations = shuffle(LOCATIONS).slice(0, NEW_VEHICLES.length);
    const listings = [
      ...EXISTING_LISTINGS,
      ...NEW_VEHICLES.map((spec, index) => buildListing(spec, locations[index])),
    ];

    const result = await prisma.vehicleListing.createMany({
      data: listings,
      skipDuplicates: true,
    });

    console.log(`Seeded ${result.count} vehicle listings (${listings.length} candidates, duplicates skipped).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
