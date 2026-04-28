'use client'

import React from "react";
import { ChevronRight, Share2, ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
import { FEATURED_ARTICLE, AUTHORS } from "../../../constants";
import { TrendingList } from "../../../components/ui/TrendingList";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";

export default function ArticleDetail() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="relative">
        <main className="flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 mb-8 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            <button className="hover:text-primary">Home</button>
            <ChevronRight className="h-3 w-3" />
            <button className="hover:text-primary">Technology</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-on-surface">Emerging Tech</span>
          </nav>

          <header className="mb-12">
            <h1 className="font-headline text-4xl lg:text-5xl font-bold leading-tight mb-8">
              {FEATURED_ARTICLE.title}
            </h1>
            <div className="flex items-center gap-4 mb-10">
              <img src={AUTHORS.MARCUS.avatar} alt="Author" className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
              <div>
                <p className="font-headline font-bold text-lg">{AUTHORS.MARCUS.name}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                  {AUTHORS.MARCUS.role} • MAY 24, 2024
                </p>
              </div>
            </div>
            <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant">
              <img src={FEATURED_ARTICLE.image} alt="Featured" className="w-full h-full object-cover" />
            </div>
            <p className="text-center text-xs text-on-surface-variant mt-4 italic font-medium">
              Illustration: A superconducting quantum circuit used in recent experiments at the Zurich Institute. (Credit: Chronicle/Getty)
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Social Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 flex flex-col items-center gap-4">
                {[Share2, ThumbsUp, MessageSquare, Bookmark].map((Icon, i) => (
                  <button key={i} className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Article Content */}
            <article className="col-span-1 lg:col-span-7 space-y-8">
              <p className="text-xl font-medium leading-relaxed text-on-surface">
                The race for quantum supremacy has moved from the laboratory to the boardroom. As major tech conglomerates announce successful error-correction milestones, the implications for global cybersecurity and financial modeling are becoming impossible to ignore.
              </p>

              <p className="text-lg leading-relaxed text-on-surface-variant">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec neque orci, lobortis eget tempus eu, blandit a libero. Integer ut tincidunt enim. Curabitur vel egestas libero. Mauris sed elit sit amet odio elementum tempor.
              </p>

              <div className="p-8 my-10 bg-surface-container border-l-4 border-primary rounded-r-2xl shadow-sm">
                <p className="font-headline text-2xl italic font-bold leading-snug text-on-surface-variant">
                  &ldquo;Quantum computing isn&apos;t just a faster way to do what we already do; it&apos;s a way to do what was previously impossible.&rdquo;
                </p>
                <p className="mt-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">— {AUTHORS.ELENA.name}, Lead Researcher</p>
              </div>

              <p className="text-lg leading-relaxed text-on-surface-variant">
                Vestibulum id ligula porta felis euismod semper. Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus.
              </p>

              <div className="grid grid-cols-2 gap-4 my-10">
                <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&h=400&fit=crop" className="rounded-xl object-cover h-48 w-full border border-outline-variant" alt="Tech detail" />
                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop" className="rounded-xl object-cover h-48 w-full border border-outline-variant" alt="Security detail" />
              </div>

              {/* Author Bio Section */}
              <section className="mt-20 p-8 bg-surface-container-low rounded-2xl border border-outline-variant">
                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                  <img src={AUTHORS.MARCUS.avatar} alt="Author" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
                  <div>
                    <h3 className="font-headline text-2xl font-bold mb-3">About {AUTHORS.MARCUS.name}</h3>
                    <p className="text-on-surface-variant leading-relaxed text-sm font-medium mb-4">
                      {AUTHORS.MARCUS.bio}
                    </p>
                    <div className="flex justify-center sm:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-primary">
                      <button className="hover:underline">Follow on Twitter</button>
                      <span className="text-outline-variant opacity-30">•</span>
                      <button className="hover:underline">Full Archive</button>
                    </div>
                  </div>
                </div>
              </section>
            </article>

            {/* Sidebar */}
            <TrendingList className="col-span-1 lg:col-span-4" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}