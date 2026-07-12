export const CATEGORY_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurant",
  CAFE: "Café",
  GROCERY_MARKET: "Grocery & Market",
  RETAIL_SHOP: "Retail Shop",
  SERVICES: "Services",
  COMPANY_B2B: "Company (B2B)",
  ACCOMMODATION: "Accommodation",
  OTHER: "Other",
};

export const PRACTICE_LABELS: Record<string, string> = {
  PLANT_BASED_OPTIONS: "Plant-based options",
  LOCALLY_SOURCED: "Locally sourced",
  ZERO_WASTE_COMPOSTING: "Zero-waste / composting",
  NO_SINGLE_USE_PLASTIC: "No single-use plastic",
  REUSABLE_PACKAGING: "Reusable packaging",
  BULK_PACKAGE_FREE: "Bulk / package-free",
  RENEWABLE_ENERGY: "Renewable energy",
  WATER_CONSERVATION: "Water conservation",
  RECYCLING_PROGRAM: "Recycling program",
  ANTI_FOOD_WASTE: "Anti food-waste",
  FAIR_ETHICAL_LABOR: "Fair / ethical labor",
  BIKE_EV_FRIENDLY: "Bike / EV friendly",
};

export const CERTIFICATION_LABELS: Record<string, string> = {
  ORGANIC_BIO_TUNISIE: "Organic — Bio Tunisie",
  EU_ORGANIC: "EU Organic",
  USDA_ORGANIC: "USDA Organic",
  FAIR_TRADE: "Fair Trade",
  ISO_14001: "ISO 14001",
  B_CORP: "B Corp",
  EU_ECOLABEL: "EU Ecolabel",
  GREEN_KEY: "Green Key",
  LEED: "LEED",
  MSC: "MSC (Sustainable Seafood)",
};

export const VERIFICATION_LABELS: Record<string, string> = {
  SELF_DECLARED: "Self-declared",
  EVIDENCE_PROVIDED: "Evidence provided",
  ADMIN_VERIFIED: "Admin verified",
};

export const GOVERNORATES = [
  "TUNIS","ARIANA","BEN_AROUS","MANOUBA","NABEUL","ZAGHOUAN","BIZERTE","BEJA",
  "JENDOUBA","KEF","SILIANA","SOUSSE","MONASTIR","MAHDIA","SFAX","KAIROUAN",
  "KASSERINE","SIDI_BOUZID","GABES","MEDENINE","TATAOUINE","GAFSA","TOZEUR","KEBILI",
] as const;

export const govLabel = (g: string) =>
  g.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");
