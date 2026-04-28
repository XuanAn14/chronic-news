'use client'

import React from "react";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Search, Bell, Settings, Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Quote, Send, Save, Eye, Calendar, CloudUpload } from "lucide-react";

export default function CMSEditor() {
  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar variant="cms" />
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="sticky top-0 z-[40] flex h-16 w-full items-center justify-between border-b border-outline-variant bg-white px-8">
           <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full bg-surface py-2 pl-10 pr-4 text-sm rounded-lg border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-4 pr-4 border-r border-outline-variant">
               <button className="relative p-2 text-on-surface-variant hover:bg-surface rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-secondary border-2 border-white" />
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right">
                <p className="text-xs font-bold">Admin Pulse</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Editor-in-Chief</p>
              </div>
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="h-8 w-8 rounded-full border border-outline-variant object-cover" alt="Admin" />
            </div>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          {/* Main Content Editor */}
          <div className="flex-1 p-8 overflow-y-auto">
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-4">
                   <input
                    type="text"
                    placeholder="Article Title"
                    className="w-full bg-transparent border-none text-4xl lg:text-5xl font-headline font-bold focus:ring-0 placeholder:text-surface-container-highest p-0"
                   />
                   <div className="flex items-center gap-2 text-on-surface-variant">
                     <span className="text-xs font-bold uppercase tracking-wider">Category:</span>
                     <select className="bg-transparent border-none text-xs font-bold uppercase tracking-wider focus:ring-0">
                       <option>Technology</option>
                       <option>Politics</option>
                       <option>Business</option>
                       <option>Lifestyle</option>
                       <option>Science</option>
                     </select>
                   </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-4 bg-white rounded-xl border border-outline-variant shadow-sm">
                  <div className="flex items-center gap-1 pr-4 border-r border-outline-variant">
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <Bold className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <Italic className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <Underline className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 pr-4 border-r border-outline-variant">
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <List className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <ListOrdered className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <Quote className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                  <textarea
                    placeholder="Start writing your article..."
                    className="w-full min-h-[400px] bg-white border border-outline-variant rounded-xl p-6 text-lg leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />

                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <CloudUpload className="h-12 w-12 text-outline mx-auto mb-4" />
                    <p className="text-on-surface-variant font-medium mb-2">Drop images here or click to upload</p>
                    <p className="text-sm text-outline">Supports JPG, PNG, GIF up to 10MB</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-outline-variant">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:bg-surface rounded-lg transition-colors">
                      <Save className="h-4 w-4" />
                      Save Draft
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:bg-surface rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-outline text-white font-bold rounded-lg hover:bg-outline-variant transition-colors">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-colors">
                      <Send className="h-4 w-4" />
                      Publish Now
                    </button>
                  </div>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-outline-variant p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Article Settings */}
              <div>
                <h3 className="font-headline font-bold text-lg mb-4">Article Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Status</label>
                    <select className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary/20">
                      <option>Draft</option>
                      <option>Ready for Review</option>
                      <option>Scheduled</option>
                      <option>Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Publish Date</label>
                    <input type="datetime-local" className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tags</label>
                    <input type="text" placeholder="Add tags..." className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div>
                <h3 className="font-headline font-bold text-lg mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Meta Title</label>
                    <input type="text" placeholder="SEO title..." className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Meta Description</label>
                    <textarea rows={3} placeholder="SEO description..." className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary/20 resize-none" />
                  </div>
                </div>
              </div>

              {/* Article Stats */}
              <div>
                <h3 className="font-headline font-bold text-lg mb-4">Article Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold font-headline">0</div>
                    <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Words</div>
                  </div>
                  <div className="bg-surface p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold font-headline">0</div>
                    <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Reading Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}