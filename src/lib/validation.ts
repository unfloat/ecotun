import { z } from "zod";

const Category = z.enum([
  "RESTAURANT","CAFE","GROCERY_MARKET","RETAIL_SHOP","SERVICES",
  "COMPANY_B2B","ACCOMMODATION","OTHER",
]);
const Governorate = z.enum([
  "TUNIS","ARIANA","BEN_AROUS","MANOUBA","NABEUL","ZAGHOUAN","BIZERTE","BEJA",
  "JENDOUBA","KEF","SILIANA","SOUSSE","MONASTIR","MAHDIA","SFAX","KAIROUAN",
  "KASSERINE","SIDI_BOUZID","GABES","MEDENINE","TATAOUINE","GAFSA","TOZEUR","KEBILI",
]);
const Practice = z.enum([
  "PLANT_BASED_OPTIONS","LOCALLY_SOURCED","ZERO_WASTE_COMPOSTING","NO_SINGLE_USE_PLASTIC",
  "REUSABLE_PACKAGING","BULK_PACKAGE_FREE","RENEWABLE_ENERGY","WATER_CONSERVATION",
  "RECYCLING_PROGRAM","ANTI_FOOD_WASTE","FAIR_ETHICAL_LABOR","BIKE_EV_FRIENDLY",
]);
const optUrl = z.string().url().optional().or(z.literal("").transform(() => undefined));

export const submissionSchema = z.object({
  name: z.string().min(2).max(120),
  category: Category,
  shortDescription: z.string().min(5).max(160),
  description: z.string().min(20).max(4000),
  governorate: Governorate,
  city: z.string().min(1).max(80),
  address: z.string().max(200).optional(),
  practices: z.array(Practice).default([]),
  website: optUrl,
  email: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().max(40).optional(),
  instagram: z.string().max(120).optional(),
  facebook: z.string().max(120).optional(),
  submitterName: z.string().max(120).optional(),
  submitterEmail: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  // honeypot — must be empty
  company_website: z.literal("").optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
