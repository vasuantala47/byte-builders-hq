"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { WikiCategory, WikiArticle } from "@/types";
import {
  BookMarked,
  Plus,
  Search,
  Tag,
  Edit3,
  Save,
  Clock,
  Sparkles,
  FileCode,
} from "lucide-react";
import { formatDate, generateId } from "@/lib/utils";

export const KnowledgeBaseView: React.FC = () => {
  const { wiki, addWikiArticle, updateWikiArticle, currentMember } = useTeam();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New Article Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<WikiCategory>("Microcontrollers");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const categories: (WikiCategory | "All")[] = [
    "All",
    "Electronics",
    "Sensors",
    "Microcontrollers",
    "Programming",
    "Mechanical",
    "Power",
    "IoT",
    "AI/ML",
    "Manufacturing",
    "Materials",
    "Documentation",
    "Hackathon",
    "Useful References",
  ];

  const filteredWiki = wiki.filter((art) => {
    const matchesCat = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const selectedArticle = wiki.find((w) => w.id === selectedArticleId) || filteredWiki[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addWikiArticle({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
    });

    setIsCreating(false);
    setNewTitle("");
    setNewContent("");
    setNewTags("");
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-pink-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Knowledge Base (Wiki)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 font-mono font-semibold">
              {wiki.length} Articles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Shared internal engineering wiki: pinout sheets, battery formulas, 3D printing guides, and firmware boilerplates.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isCreating ? "Close Form" : "Create Wiki Article"}</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-pink-500 text-white font-bold"
                  : "bg-[#0C121F] border border-[#1C273C] text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wiki articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs outline-none focus:border-pink-400 font-sans"
          />
        </div>
      </div>

      {/* New Article Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-[#0D1524] border border-pink-500/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400 font-mono uppercase">
              Draft Internal Wiki Guide
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Author: {currentMember.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder="Article Title (e.g. SPI Bus Speed Optimization & Pin Mappings)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as WikiCategory)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <textarea
              required
              rows={6}
              placeholder="Write article in markdown. Code blocks, pinout tables, and calculations supported..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none focus:border-pink-400"
            />
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated, e.g. SPI, ESP32, Signals)"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs font-mono"
            >
              Publish to Wiki
            </button>
          </div>
        </form>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {filteredWiki.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0D1422] border border-[#1C273C] text-slate-500 text-xs font-mono">
              No articles found.
            </div>
          ) : (
            filteredWiki.map((art) => {
              const isSelected = selectedArticle?.id === art.id;

              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#161221] border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                      : "bg-[#0D1422] border-[#1C273C] hover:border-[#2C3852]"
                  }`}
                >
                  <span className="text-[10px] font-mono text-pink-400 uppercase font-semibold">
                    {art.category}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <div className="mt-3 pt-2 border-t border-[#182338] flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{art.tags.join(" • ")}</span>
                    <span>{art.updatedAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Article Viewer */}
        <div className="lg:col-span-8 bg-[#0D1422] border border-[#1C273C] rounded-xl p-6 overflow-y-auto max-h-[75vh] space-y-5">
          {selectedArticle ? (
            <>
              <div className="pb-4 border-b border-[#1C273C]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold uppercase">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Last updated: {selectedArticle.updatedAt}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedArticle.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#131C2D] border border-[#1E2B42] text-slate-300 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Markdown Content Viewer */}
              <div className="text-xs text-slate-200 leading-relaxed font-sans bg-[#080D18] p-5 rounded-xl border border-[#172236] whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select an article to view internal documentation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
