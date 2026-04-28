import React from "react";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-12 w-full border-t border-outline-variant bg-surface-container-lowest py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="font-headline text-lg font-bold">
            ChronicleDaily
          </Link>
          <p className="text-sm text-on-surface-variant">
            © 2024 ChronicleDaily Media Group. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {["About Us", "Contact", "Privacy Policy", "Terms of Service", "Archive"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4">
          <button className="text-outline hover:text-primary transition-colors">
            <Globe className="h-5 w-5" />
          </button>
          <button className="text-outline hover:text-primary transition-colors">
            <Mail className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
