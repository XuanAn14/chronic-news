import { redirect } from "next/navigation";
import { Sidebar } from "../../components/layout/Sidebar";
import { SAVED_ARTICLES } from "../../constants";
import { ArticleCard } from "../../components/ui/ArticleCard";
import { MemoryStick as Memory, Gavel, FlaskConical as Science, Coffee as Lifestyle, BarChart3 as Monitoring } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { getSiteUserFromCookie } from "../../lib/site-auth";
import { SiteLogoutButton } from "../../components/auth/SiteLogoutButton";

export default async function UserSettings() {
  const user = await getSiteUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  const interests = [
    { name: "Technology", desc: "AI, Gadgets, Software development", icon: Memory, checked: true },
    { name: "Politics", desc: "Global affairs, Elections, Policy", icon: Gavel, checked: false },
    { name: "Science", desc: "Space, Health, Biology", icon: Science, checked: true },
    { name: "Lifestyle", desc: "Travel, Design, Culture", icon: Lifestyle, checked: true },
    { name: "Business", desc: "Finance, Markets, Economy", icon: Monitoring, checked: false },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Sidebar variant="account" />
            <div className="flex-1">
              <header className="mb-12">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="font-headline text-4xl font-bold mb-2">Saved Articles</h1>
                    <p className="text-on-surface-variant font-medium">
                      Signed in as {user.name} ({user.email})
                    </p>
                  </div>
                  <SiteLogoutButton />
                </div>
              </header>

              <section className="mb-16">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-bold">Saved for Later</h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                    4 ARTICLES
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SAVED_ARTICLES.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              </section>

              <hr className="border-outline-variant mb-16" />

              <section>
                <div className="mb-8">
                  <h2 className="font-headline text-2xl font-bold">Interests & Personalization</h2>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">Choose the topics you want to see more of in your daily feed.</p>
                </div>

                <div className="overflow-hidden border border-outline-variant bg-surface-container-lowest rounded-2xl divide-y divide-outline-variant">
                  {interests.map((interest) => {
                    const Icon = interest.icon;
                    return (
                      <div key={interest.name} className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-lg">{interest.name}</h3>
                            <p className="text-sm text-on-surface-variant">{interest.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={interest.checked} />
                          <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
