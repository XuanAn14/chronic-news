import { Footer } from "../../../components/layout/Footer";
import { Navbar } from "../../../components/layout/Navbar";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-4 py-6">
        <div className="mb-6 h-4 w-56 animate-pulse rounded bg-surface-container" />
        <div className="mb-8 h-20 animate-pulse rounded-xl bg-surface-container" />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-9">
            <div className="grid grid-cols-1 border border-outline-variant bg-white md:grid-cols-2">
              <div className="h-[300px] animate-pulse bg-surface-container md:h-[480px]" />
              <div className="space-y-5 p-6">
                <div className="h-4 w-32 animate-pulse rounded bg-surface-container" />
                <div className="h-10 animate-pulse rounded bg-surface-container" />
                <div className="h-10 w-10/12 animate-pulse rounded bg-surface-container" />
                <div className="h-5 w-full animate-pulse rounded bg-surface-container" />
                <div className="h-5 w-9/12 animate-pulse rounded bg-surface-container" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-72 animate-pulse border border-outline-variant bg-white" />
              ))}
            </div>
          </div>
          <aside className="col-span-12 hidden lg:col-span-3 lg:block">
            <div className="h-96 animate-pulse border border-outline-variant bg-surface-container-low" />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
