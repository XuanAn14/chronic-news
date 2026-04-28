require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@chronic.news";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";
  const adminName = "Chronicle Admin";

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
