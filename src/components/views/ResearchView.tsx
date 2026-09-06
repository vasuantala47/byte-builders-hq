"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  BookOpen,
  Plus,
  ExternalLink,
  Tag,
  MessageSquare,
  Search,
  Sparkles,
  Paperclip,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const ResearchView: React.FC = () => {
  const { research, members, addResearchComment, setIsContributeOpen, setIsByteBotOpen } = useTeam();

  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const availableTags = [
    "All",
    "Hardware",
    "Electronics",
    "Sensors",
    "Microcontrollers",
    "Power",
    "Mechanical",
    "IoT",
    "AI",
    "Communication",
    "Manufacturing",
  ];

  const filteredResearch = research.filter((item) => {
    const matchesTag =
      selectedTag === "All" ||
      item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()) ||
      item.topic.toLowerCase().includes(selectedTag.toLowerCase());
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyFindings.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const selectedItem = research.find((r) => r.id === selectedResId) || filteredResearch[0];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !commentInput.trim()) return;
    addResearchComment(selectedItem.id, commentInput.trim());
    setCommentInput("");
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Research Hub
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono">
              {research.length} Papers & Datasheets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Datasheets, power profiling logs, RF simulations, and technical findings verified by the team.
          </p>
        </div>

        <button
          onClick={() => setIsContributeOpen(true)}
          className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Research</span>
        </button>
      </div>

      {/* Tag Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-[#0C121F] border border-[#1C273C] text-slate-400 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search research & datasheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {filteredResearch.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0D1422] border border-[#1C273C] text-slate-500 text-xs font-mono">
              No research entries found matching this tag.
            </div>
          ) : (
            filteredResearch.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const author = members.find((m) => m.id === item.authorId);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedResId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#101726] border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "bg-[#0D1422] border-[#1C273C] hover:border-[#2A3B58]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                      {item.topic}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#182338] flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-slate-400">By {author ? author.name.split(" ")[0] : "Member"}</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageSquare className="w-3 h-3" />
                      <span>{item.comments.length}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Dossier View */}
        <div className="lg:col-span-7 bg-[#0D1422] border border-[#1C273C] rounded-xl p-5 overflow-y-auto max-h-[75vh] space-y-5">
          {selectedItem ? (
            <>
              {/* Dossier Header */}
              <div className="pb-4 border-b border-[#1C273C]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                    {selectedItem.topic}
                  </span>
                  {selectedItem.sourceUrl && (
                    <a
                      href={selectedItem.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      <span>Datasheet / Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h2 className="text-base font-bold text-white">{selectedItem.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
                  <span>Author: {members.find((m) => m.id === selectedItem.authorId)?.name || "Member"}</span>
                  <span>•</span>
                  <span>{formatDate(selectedItem.createdAt)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedItem.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#131C2D] border border-[#1E2B42] text-slate-300 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Technical Breakdown */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Summary & Objective
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {selectedItem.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-cyan-400 uppercase tracking-wider font-semibold text-[11px] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Findings & Measurements</span>
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-cyan-500/20 leading-relaxed font-mono">
                    {selectedItem.keyFindings}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      What We Learned
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                      {selectedItem.whatWeLearned}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      How It Helps Byte Builders
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                      {selectedItem.howItHelps}
                    </p>
                  </div>
                </div>

                {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1 flex items-center gap-1.5">
                      <Paperclip className="w-3 h-3" />
                      <span>Attachments</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-xs font-mono text-cyan-300 flex items-center gap-2"
                        >
                          <span>{att}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Research Discussion */}
              <div className="pt-4 border-t border-[#1C273C] space-y-3">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Discussion & Peer Review ({selectedItem.comments.length})</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItem.comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No notes on this research yet.</p>
                  ) : (
                    selectedItem.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-lg bg-[#080D18] border border-[#172236] text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-cyan-300">{c.authorName}</span>
                          <span className="font-mono text-slate-500">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-slate-200">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Box */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technical comments or question findings..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-3.5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white font-bold text-xs font-mono transition-colors"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select a research paper to review findings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
