require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();
const defaultCategories = [
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

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@chronic.news";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";
  const adminName = "Chronicle Admin";
  const authorEmail = process.env.AUTHOR_EMAIL || "author@chronic.news";
  const authorPassword = process.env.AUTHOR_PASSWORD || "Author@1234";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashPassword(adminPassword),
      name: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      name: adminName,
    },
  });

  await prisma.siteUser.upsert({
    where: { email: authorEmail },
    update: {
      passwordHash: hashPassword(authorPassword),
      name: "Marcus Hale",
      role: "AUTHOR",
    },
    create: {
      email: authorEmail,
      passwordHash: hashPassword(authorPassword),
      name: "Marcus Hale",
      role: "AUTHOR",
    },
  });

  for (const categoryName of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: {
        name: categoryName,
      },
      create: {
        name: categoryName,
        slug: slugify(categoryName),
      },
    });
  }

  await prisma.article.deleteMany({
    where: {
      slug: {
        in: [
          "quantum-leap-silicon-valley",
          "remote-work-hybrid-revolution",
          "urban-architecture-sustainable-cities-2024",
          "future-of-ai-in-modern-newsrooms",
          "economic-shifts-quarterly-report-analysis",
          "remote-work-3-years-later",
        ],
      },
    },
  });

  console.log("Database seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
