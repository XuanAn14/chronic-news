import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="h-80 animate-pulse rounded-xl bg-surface-container lg:w-64" />
            <div className="min-w-0 flex-1 space-y-6">
              <div className="h-12 w-72 max-w-full animate-pulse rounded bg-surface-container" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-44 animate-pulse rounded-xl bg-surface-container" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
