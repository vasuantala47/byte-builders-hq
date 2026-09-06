"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  Search,
  X,
  ArrowRight,
  Lightbulb,
  BookOpen,
  CheckSquare,
  Cpu,
  FlaskConical,
  Layers,
  FileCheck2,
  BookMarked,
  Sparkles,
} from "lucide-react";
import { TabType } from "@/types";

export const UniversalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchAllEntities, setActiveTab, setIsByteBotOpen } = useTeam();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = searchAllEntities(query);

  const getCategoryIcon = (tab: TabType) => {
    switch (tab) {
      case "ideas":
        return <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />;
      case "research":
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case "tasks":
        return <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />;
      case "components":
        return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      case "experiments":
        return <FlaskConical className="w-3.5 h-3.5 text-purple-400" />;
      case "prototypes":
        return <Layers className="w-3.5 h-3.5 text-orange-400" />;
      case "decisions":
        return <FileCheck2 className="w-3.5 h-3.5 text-red-400" />;
      case "wiki":
        return <BookMarked className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Search className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleSelectResult = (tab: TabType) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0B101C] border border-[#1E2E4A] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1C273C] flex items-center gap-3 bg-[#080D17]">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search ideas, research, tasks, components, experiments, prototypes, decisions, wiki (e.g. 'ESP32')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-[#141F33] text-slate-400 px-1.5 py-0.5 rounded font-mono border border-[#1F2F4E]">
            ESC
          </kbd>
        </div>

        {/* Quick Jump / AI Copilot prompt */}
        <div className="px-4 py-2 bg-[#0E1524] border-b border-[#182338] flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono">
            {query
              ? `Found ${results.length} item${results.length === 1 ? "" : "s"} across all modules`
              : "Search the complete Byte Builders innovation repository"}
          </span>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setIsByteBotOpen(true);
            }}
            className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask ByteBot instead</span>
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {query && results.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No results found matching &quot;{query}&quot;.
              <div className="mt-2 text-slate-400">
                Try searching for &quot;ESP32&quot;, &quot;sensor&quot;, &quot;LoRa&quot;, or &quot;battery&quot;.
              </div>
            </div>
          )}

          {!query && (
            <div className="p-6 text-center text-slate-400 text-xs">
              <p className="font-mono text-slate-300">Quick Searches:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {["ESP32-S3", "BME688", "LoRa SX1262", "Deep Sleep", "Prototype V2", "ADR-01"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-md bg-[#131E30] hover:bg-[#1A2840] border border-[#1E2E4A] text-slate-300 font-mono text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((res) => (
            <div
              key={`${res.tab}-${res.id}`}
              onClick={() => handleSelectResult(res.tab)}
              className="p-3 rounded-xl hover:bg-[#121B2C] border border-transparent hover:border-[#1E2E4A] cursor-pointer transition-all flex items-start justify-between group"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1 pr-3">
                <div className="p-2 rounded-lg bg-[#141F33] border border-[#1E2D48] mt-0.5">
                  {getCategoryIcon(res.tab)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                      {res.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#18253A] text-slate-400 font-mono flex-shrink-0">
                      {res.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {res.snippet}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 pt-1">
                <span className="text-[10px] font-mono uppercase hidden sm:inline">Open</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1C273C] bg-[#080D17] flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Search spans Ideas, Research, Tasks, Hardware, Tests, ADRs & Wiki</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
