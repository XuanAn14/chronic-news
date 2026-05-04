import { Footer } from "../../../components/layout/Footer";
import { Navbar } from "../../../components/layout/Navbar";

export default function ArticleLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-4 w-72 max-w-full animate-pulse rounded bg-surface-container" />
        <div className="mb-8 h-12 w-full max-w-4xl animate-pulse rounded bg-surface-container" />
        <div className="mb-10 h-14 w-64 animate-pulse rounded bg-surface-container" />
        <div className="mb-12 aspect-[21/9] w-full animate-pulse rounded-2xl bg-surface-container" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-8">
            <div className="h-5 animate-pulse rounded bg-surface-container" />
            <div className="h-5 w-11/12 animate-pulse rounded bg-surface-container" />
            <div className="h-5 w-10/12 animate-pulse rounded bg-surface-container" />
            <div className="h-5 w-8/12 animate-pulse rounded bg-surface-container" />
          </div>
          <div className="hidden space-y-4 lg:col-span-4 lg:block">
            <div className="h-40 animate-pulse rounded-xl bg-surface-container" />
            <div className="h-40 animate-pulse rounded-xl bg-surface-container" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
