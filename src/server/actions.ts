"use server";

import { db } from "@/lib/db";
import { submissionSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export type SubmitState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitBusiness(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const raw: Record<string, unknown> = Object.fromEntries(formData);
  raw.practices = formData.getAll("practices");

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please fix the errors below.",
    };
  }

  const d = parsed.data;

  // Honeypot: already enforced by schema (must be ""), double-check silently
  if ((raw.company_website as string)?.length) {
    return { ok: true }; // silently accept-but-drop bots
  }

  let slug = slugify(d.name);
  if (await db.business.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  // Strip honeypot field before writing to DB
  const { company_website: _hp, ...rest } = d;

  // Map optional fields: omit undefined values, and ensure practices is correct type
  await db.business.create({
    data: {
      slug,
      name: rest.name,
      category: rest.category,
      shortDescription: rest.shortDescription,
      description: rest.description,
      governorate: rest.governorate,
      city: rest.city,
      ...(rest.address !== undefined && { address: rest.address }),
      practices: rest.practices ?? [],
      ...(rest.website !== undefined && { website: rest.website }),
      ...(rest.email !== undefined && { email: rest.email }),
      ...(rest.phone !== undefined && { phone: rest.phone }),
      ...(rest.instagram !== undefined && { instagram: rest.instagram }),
      ...(rest.facebook !== undefined && { facebook: rest.facebook }),
      ...(rest.submitterName !== undefined && { submitterName: rest.submitterName }),
      ...(rest.submitterEmail !== undefined && { submitterEmail: rest.submitterEmail }),
      status: "PENDING",
      verification: "SELF_DECLARED",
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}
