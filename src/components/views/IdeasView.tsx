"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { IdeaStatus } from "@/types";
import {
  Lightbulb,
  Plus,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  FolderKanban,
  CheckSquare,
  Archive,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const IdeasView: React.FC = () => {
  const {
    ideas,
    members,
    currentMember,
    upvoteIdea,
    updateIdeaStatus,
    addIdeaComment,
    convertIdeaToProject,
    convertIdeaToTask,
    setIsContributeOpen,
    setIsByteBotOpen,
  } = useTeam();

  const [activeTabFilter, setActiveTabFilter] = useState<"active" | "graveyard">("active");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");

  const activeIdeas = ideas.filter((i) => i.status !== "Rejected");
  const rejectedIdeas = ideas.filter((i) => i.status === "Rejected");

  const currentList = activeTabFilter === "active" ? activeIdeas : rejectedIdeas;

  const filteredIdeas = currentList.filter((idea) => {
    const matchesStatus =
      statusFilter === "All" || idea.status === statusFilter;
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.proposedSolution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedIdea = ideas.find((i) => i.id === selectedIdeaId) || filteredIdeas[0];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdea || !commentInput.trim()) return;
    addIdeaComment(selectedIdea.id, commentInput.trim());
    setCommentInput("");
  };

  const allStatuses: IdeaStatus[] = [
    "New",
    "Discussing",
    "Promising",
    "Selected",
    "Building",
    "Testing",
    "Implemented",
    "Rejected",
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Idea Vault
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
              {ideas.length} Concepts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Collaborative hardware concepts. Convert promising ideas to Projects or Tasks. Old concepts preserved in Graveyard.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsContributeOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Submit Idea</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Active Vault vs Idea Graveyard */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#0C121F] p-1 rounded-xl border border-[#1C273C]">
          <button
            onClick={() => {
              setActiveTabFilter("active");
              setStatusFilter("All");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTabFilter === "active"
                ? "bg-cyan-400 text-black font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Active Vault ({activeIdeas.length})
          </button>
          <button
            onClick={() => {
              setActiveTabFilter("graveyard");
              setStatusFilter("All");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTabFilter === "graveyard"
                ? "bg-red-500/20 text-red-400 border border-red-500/40 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Idea Graveyard ({rejectedIdeas.length})</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {activeTabFilter === "active" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-slate-300 text-xs font-mono outline-none focus:border-cyan-400"
            >
              <option value="All">All Statuses</option>
              {allStatuses
                .filter((s) => s !== "Rejected")
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {/* Two-Pane Idea Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Idea Cards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {filteredIdeas.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0D1422] border border-[#1C273C] text-slate-500 text-xs font-mono">
              {activeTabFilter === "graveyard"
                ? "Idea Graveyard is empty. No concepts archived."
                : "No ideas found. Click ＋ Submit Idea to propose a concept."}
            </div>
          ) : (
            filteredIdeas.map((idea) => {
              const isSelected = selectedIdea?.id === idea.id;
              const hasUpvoted = idea.upvotes.includes(currentMember.id);
              const author = members.find((m) => m.id === idea.authorId);

              return (
                <div
                  key={idea.id}
                  onClick={() => setSelectedIdeaId(idea.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#111A2D] border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                      : "bg-[#0D1422] border-[#1C273C] hover:border-[#2C3E60]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {idea.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold flex-shrink-0 ${
                        idea.status === "Building" || idea.status === "Selected"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : idea.status === "Rejected"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {idea.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {idea.proposedSolution || idea.problem}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#182338] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      {author && (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{author ? author.name.split(" ")[0] : "Member"}</span>
                      <span>•</span>
                      <span>{formatDate(idea.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          upvoteIdea(idea.id);
                        }}
                        className={`flex items-center gap-1 transition-colors ${
                          hasUpvoted ? "text-cyan-400 font-bold" : "hover:text-slate-300"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{idea.upvotes.length}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{idea.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Idea In-Depth Dossier (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0D1422] border border-[#1C273C] rounded-xl p-5 overflow-y-auto max-h-[75vh] space-y-5">
          {selectedIdea ? (
            <>
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#1C273C]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        selectedIdea.status === "Building" || selectedIdea.status === "Selected"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : selectedIdea.status === "Rejected"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      {selectedIdea.status}
                    </span>
                    {selectedIdea.estimatedCost > 0 && (
                      <span className="text-xs text-slate-400 font-mono">
                        Est. Cost: ${selectedIdea.estimatedCost.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedIdea.title}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Submitted by {members.find((m) => m.id === selectedIdea.authorId)?.name || "Member"} on{" "}
                    {formatDate(selectedIdea.createdAt)}
                  </p>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedIdea.status}
                    onChange={(e) => updateIdeaStatus(selectedIdea.id, e.target.value as IdeaStatus)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-xs font-mono text-cyan-400 outline-none"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>
                        Status: {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Actions (Idea -> Project / Task) */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-[#080D18] border border-[#1C273C]">
                <span className="text-[11px] font-mono text-slate-400">Actions:</span>
                <button
                  onClick={() => convertIdeaToProject(selectedIdea.id)}
                  className="px-2.5 py-1 rounded bg-[#131E30] hover:bg-[#1A2840] border border-[#233554] text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Convert to Primary Project</span>
                </button>
                <button
                  onClick={() => convertIdeaToTask(selectedIdea.id)}
                  className="px-2.5 py-1 rounded bg-[#131E30] hover:bg-[#1A2840] border border-[#233554] text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Convert to Kanban Task</span>
                </button>
                <button
                  onClick={() => setIsByteBotOpen(true)}
                  className="px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 ml-auto"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Review Idea</span>
                </button>
              </div>

              {/* Technical Breakdown */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Problem It Solves
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {selectedIdea.problem}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Proposed Solution & How It Works
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {selectedIdea.explanation || selectedIdea.proposedSolution}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      Required Hardware
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-[#172236]">
                      {selectedIdea.requiredHardware || "To be determined"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      Required Software / Firmware
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-[#172236]">
                      {selectedIdea.requiredSoftware || "C++ / FreeRTOS"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      Key Advantages
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-emerald-500/20">
                      {selectedIdea.advantages || "Lightweight, low cost"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-amber-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      Technical Risks
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-amber-500/20">
                      {selectedIdea.risks || "Thermal drift, moisture sensitivity"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discussion & Comments */}
              <div className="pt-4 border-t border-[#1C273C] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Team Discussion ({selectedIdea.comments.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    All 6 members equal contributors
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedIdea.comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      No comments yet. Start the discussion below.
                    </p>
                  ) : (
                    selectedIdea.comments.map((c) => (
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

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Suggest improvements, pinout tips, component substitutions..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-bold text-xs font-mono transition-colors"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select an idea from the left to view technical specs and comments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
