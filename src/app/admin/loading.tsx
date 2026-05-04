export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 animate-pulse border-r border-slate-200 bg-slate-100 lg:block" />
      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white" />
        <main className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden xl:flex-row">
          <section className="flex-1 p-4 sm:p-6">
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="h-16 w-full animate-pulse rounded-xl bg-slate-200" />
              <div className="grid gap-4 md:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-28 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
              <div className="h-[36rem] animate-pulse rounded-xl bg-slate-200" />
            </div>
          </section>
          <aside className="hidden w-80 border-l border-slate-200 bg-white p-6 xl:block">
            <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
          </aside>
        </main>
      </div>
    </div>
  );
}
