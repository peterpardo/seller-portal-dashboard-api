import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export function generateSlug(text: string) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export async function generateUniqueStoreSlug(
  prisma: PrismaClient | any,
  name: string
) {
  const baseSlug = generateSlug(name);
  const lastStore = await prisma.store.findFirst({
    where: { slug: { startsWith: baseSlug } },
    orderBy: { slug: "desc" },
  });

  let slug = baseSlug;
  if (lastStore) {
    const match = lastStore.slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
    const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
    slug = `${baseSlug}-${nextNumber}`;
  }

  return slug;
}
