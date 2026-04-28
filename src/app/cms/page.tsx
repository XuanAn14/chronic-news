import React from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Search, Bell, Settings, TrendingUp, FileText, UserPlus, Filter, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export default function CMSDashboard() {
  const stats = [
    { label: "Daily Views", value: "128.4k", trend: "+12%", color: "primary" },
    { label: "Engagement", value: "4.2%", trend: "+0.8%", color: "green" },
    { label: "Total Posts", value: "1,402", trend: "75% Target", icon: FileText, color: "secondary" },
    { label: "Active Editors", value: "24", trend: "+2 Today", icon: UserPlus, color: "blue" },
  ];

  const recentPosts = [
    { title: "The Rise of Quantum Computing in FinTech", category: "Tech & Economy", status: "Published", author: "Elena Vance", date: "Oct 24, 2023", time: "10:45 AM" },
    { title: "Urban Architecture: Sustainable Cities in 2024", category: "Environment", status: "Scheduled", author: "Marcus Chen", date: "Oct 26, 2023", time: "09:00 AM" },
    { title: "Global Trade Policy: Impact on Local Markets", category: "Politics", status: "Draft", author: "Sarah Jenkins", date: "Oct 23, 2023", time: "03:15 PM" },
  ];

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar variant="cms" />
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="sticky top-0 z-[40] flex h-16 w-full items-center justify-between border-b border-outline-variant bg-white px-8">
           <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              type="text"
              placeholder="Search articles, users, or metrics..."
              className="w-full bg-surface py-2 pl-10 pr-4 text-sm rounded-lg border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-outline-variant">
               <button className="relative p-2 rounded-lg hover:bg-surface transition-colors">
                <Bell className="h-5 w-5 text-on-surface-variant" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-secondary border-2 border-white" />
              </button>
              <button className="p-2 rounded-lg hover:bg-surface transition-colors">
                <Settings className="h-5 w-5 text-on-surface-variant" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin Pulse</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Editor in Chief</p>
              </div>
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="h-10 w-10 rounded-full border-2 border-primary/20 object-cover" alt="Admin" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Content Management Dashboard</h1>
            <p className="text-on-surface-variant">Monitor performance, manage content, and oversee editorial workflow.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                    stat.color === "primary" && "bg-primary/10 text-primary",
                    stat.color === "green" && "bg-green-100 text-green-700",
                    stat.color === "secondary" && "bg-secondary/10 text-secondary",
                    stat.color === "blue" && "bg-blue-100 text-blue-700"
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold font-headline mb-1">{stat.value}</div>
                <div className="text-sm text-on-surface-variant font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Posts Table */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Recent Posts</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface rounded-lg transition-colors">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                  <button className="bg-primary text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-primary-container transition-colors">
                    + New Post
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Title</th>
                    <th className="text-left p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                    <th className="text-left p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Author</th>
                    <th className="text-left p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="text-left p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post, index) => (
                    <tr key={index} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-on-surface">{post.title}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                          {post.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider",
                          post.status === "Published" && "bg-green-100 text-green-700",
                          post.status === "Scheduled" && "bg-blue-100 text-blue-700",
                          post.status === "Draft" && "bg-gray-100 text-gray-700"
                        )}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-on-surface-variant">{post.author}</td>
                      <td className="p-4 text-sm text-on-surface-variant">
                        <div>{post.date}</div>
                        <div className="text-xs">{post.time}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-surface rounded">
                            <Edit2 className="h-4 w-4 text-on-surface-variant" />
                          </button>
                          <button className="p-1 hover:bg-surface rounded">
                            <Trash2 className="h-4 w-4 text-on-surface-variant" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-outline-variant flex items-center justify-between">
              <div className="text-sm text-on-surface-variant">
                Showing 1 to 10 of 1,402 results
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-surface transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg">1</button>
                <button className="px-3 py-1 text-on-surface-variant hover:bg-surface text-sm font-bold rounded-lg">2</button>
                <button className="px-3 py-1 text-on-surface-variant hover:bg-surface text-sm font-bold rounded-lg">3</button>
                <button className="p-2 rounded-lg hover:bg-surface transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}