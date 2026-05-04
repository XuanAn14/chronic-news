export default function AuthorLoading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="sticky top-0 z-40 h-14 border-b border-gray-200 bg-white/95" />
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-64 animate-pulse border-r border-gray-200 bg-white lg:block" />
        <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 md:p-6 lg:ml-64">
          <div className="mb-6 h-16 w-full animate-pulse rounded-lg bg-surface-container" />
          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-lg bg-surface-container" />
            ))}
          </section>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 h-[32rem] animate-pulse rounded-lg bg-surface-container lg:col-span-8" />
            <div className="col-span-12 h-80 animate-pulse rounded-lg bg-surface-container lg:col-span-4" />
          </div>
        </main>
      </div>
    </div>
  );
}
