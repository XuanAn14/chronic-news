import { hasConfiguredDatabase } from "./env";
import prisma from "./prisma";
import { slugify } from "./editor";

export const DEFAULT_CATEGORIES = [
  "World",
  "Politics",
  "Technology",
  "Lifestyle",
  "Business",
  "Science",
  "Economy",
  "Cybersecurity",
  "Markets",
];

export async function getCategoryRecords() {
  if (!hasConfiguredDatabase()) {
    return DEFAULT_CATEGORIES.map((name) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  const records = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!records.length) {
    return DEFAULT_CATEGORIES.map((name) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return records;
}

export async function getCategoryOptions() {
  const records = await getCategoryRecords();
  return records.map((item) => item.name);
}
