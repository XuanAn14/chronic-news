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

  const admin = await prisma.adminUser.upsert({
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

  const authorUser = await prisma.siteUser.upsert({
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

  const sampleArticles = [
    {
      title: "The Quantum Leap: Silicon Valley's Next Decade of Computing Defined",
      slug: "quantum-leap-silicon-valley",
      excerpt:
        "A deep dive into how quantum computing is reshaping investment, regulation, and global technology strategies.",
      content:
        "The race for quantum supremacy has moved from the laboratory to the boardroom.\n\nMajor tech companies are betting on fault-tolerant hardware while regulators evaluate the impact on encryption, national infrastructure, and capital allocation.\n\nThe next phase will be decided by commercial viability rather than prototypes alone.",
      category: "Technology",
      status: "Published",
      author: adminName,
      featuredImage:
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop",
      publishedAt: new Date(),
      authorId: admin.id,
      views: 42391,
      likesCount: 2100,
      commentsCount: 124,
    },
    {
      title: "Remote Work: The Hybrid Revolution Two Years On",
      slug: "remote-work-hybrid-revolution",
      excerpt:
        "How global newsrooms and editorial teams are adapting to a blended office-home workflow.",
      content:
        "News production has shifted toward a distributed model.\n\nEditors are balancing speed, accuracy, and a new type of collaboration across continents.\n\nThe winning organizations are building process discipline instead of relying on location alone.",
      category: "Business",
      status: "Published",
      author: adminName,
      featuredImage:
        "https://images.unsplash.com/photo-1492760864395-90ba60e7ded0?w=1200&h=800&fit=crop",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      authorId: admin.id,
      views: 18502,
      likesCount: 842,
      commentsCount: 56,
    },
    {
      title: "Urban Architecture: Sustainable Cities in 2024",
      slug: "urban-architecture-sustainable-cities-2024",
      excerpt:
        "Design, policy, and community planning are converging in the next generation of cities.",
      content:
        "From green rooftops to pedestrian-first districts, urban planners are reimagining what a modern city should prioritize.\n\nThe strongest programs combine zoning reform, transit access, and measurable sustainability targets.",
      category: "Lifestyle",
      status: "Draft",
      author: adminName,
      featuredImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop",
      authorId: admin.id,
      views: 0,
      likesCount: 0,
      commentsCount: 0,
    },
    {
      title: "The Future of AI in Modern Newsrooms",
      slug: "future-of-ai-in-modern-newsrooms",
      excerpt:
        "An author-side sample exploring how automation, search, and editorial review reshape daily newsroom output.",
      content:
        "AI is already embedded into newsroom operations, from transcript cleanup to archive search.\n\nThe challenge is no longer whether to use automation, but how to layer it into editorial judgment without flattening reporting quality.\n\nThe best workflows give authors faster research loops while keeping final accountability clearly human.",
      category: "Technology",
      status: "Published",
      author: "Marcus Hale",
      featuredImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      siteAuthorId: authorUser.id,
      views: 42391,
      likesCount: 2100,
      commentsCount: 124,
    },
    {
      title: "Economic Shifts: Quarterly Report Analysis",
      slug: "economic-shifts-quarterly-report-analysis",
      excerpt:
        "A writer's market analysis draft reviewing sector-by-sector movement and investor caution signals.",
      content:
        "Quarterly filings suggest a split market narrative.\n\nInfrastructure and semiconductor demand remain firm, while ad spending and discretionary software budgets are under more scrutiny.\n\nAuthors covering finance need to compare revenue quality, not just topline momentum.",
      category: "Business",
      status: "Draft",
      author: "Marcus Hale",
      featuredImage:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop",
      siteAuthorId: authorUser.id,
      views: 0,
      likesCount: 0,
      commentsCount: 0,
    },
    {
      title: "Remote Work: 3 Years Later",
      slug: "remote-work-3-years-later",
      excerpt:
        "A follow-up on hybrid work, managerial trust, and how distributed teams changed editorial operations.",
      content:
        "Hybrid work is no longer a temporary accommodation.\n\nThe more interesting shift is how editorial teams document decisions, manage async review, and preserve a common voice across time zones.\n\nWriters with strong process now outperform those relying on constant meetings.",
      category: "Lifestyle",
      status: "Published",
      author: "Marcus Hale",
      featuredImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      siteAuthorId: authorUser.id,
      views: 18502,
      likesCount: 842,
      commentsCount: 56,
    },
  ];

  for (const article of sampleArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

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
