"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { SuggestionStatus } from "@/types";
import {
  MessageSquareShare,
  Plus,
  ThumbsUp,
  Lightbulb,
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const SuggestionsView: React.FC = () => {
  const {
    suggestions,
    members,
    currentMember,
    submitSuggestion,
    supportSuggestion,
    updateSuggestionStatus,
    convertSuggestionToIdea,
    convertSuggestionToTask,
    setIsByteBotOpen,
  } = useTeam();

  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !contentInput.trim()) return;
    submitSuggestion(titleInput.trim(), contentInput.trim());
    setTitleInput("");
    setContentInput("");
    setIsSubmitting(false);
  };

  const statuses: SuggestionStatus[] = ["Open", "Discussing", "Accepted", "Implemented", "Rejected"];

  const filteredSuggestions = suggestions.filter(
    (s) => filterStatus === "All" || s.status === filterStatus
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareShare className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Open Suggestions Board
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono">
              {suggestions.length} Suggestions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quick, informal hardware ideas and component tweaks. Any member can propose, support, or promote to Ideas and Tasks.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitting(!isSubmitting)}
          className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isSubmitting ? "Close Form" : "Post Suggestion"}</span>
        </button>
      </div>

      {/* Quick Add Form Dropdown */}
      {isSubmitting && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-[#0D1524] border border-emerald-500/40 space-y-3 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 font-mono uppercase">
              Quick Hardware Proposal
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Posting as {currentMember.name}
            </span>
          </div>

          <input
            type="text"
            required
            placeholder="e.g. What if we use a magnetic reed switch instead of a button?"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-emerald-400"
          />

          <textarea
            required
            rows={3}
            placeholder="Explain why this could be better, how it affects weight, power, or ease of assembly..."
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-emerald-400"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsSubmitting(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono transition-colors"
            >
              Share with Team
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilterStatus("All")}
          className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-colors ${
            filterStatus === "All"
              ? "bg-emerald-400 text-black font-bold"
              : "bg-[#0C121F] border border-[#1C273C] text-slate-400 hover:text-white"
          }`}
        >
          All ({suggestions.length})
        </button>
        {statuses.map((st) => {
          const count = suggestions.filter((s) => s.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-colors ${
                filterStatus === st
                  ? "bg-emerald-400 text-black font-bold"
                  : "bg-[#0C121F] border border-[#1C273C] text-slate-400 hover:text-white"
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Suggestions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuggestions.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-xl bg-[#0D1422] border border-[#1C273C] text-slate-500 text-xs font-mono">
            No suggestions in this category. Click &quot;Post Suggestion&quot; to add one!
          </div>
        ) : (
          filteredSuggestions.map((sug) => {
            const author = members.find((m) => m.id === sug.authorId);
            const hasSupported = sug.supports.includes(currentMember.id);

            return (
              <div
                key={sug.id}
                className="hardware-card rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {sug.title}
                    </h3>

                    {/* Status Dropdown */}
                    <select
                      value={sug.status}
                      onChange={(e) =>
                        updateSuggestionStatus(sug.id, e.target.value as SuggestionStatus)
                      }
                      className="text-[10px] font-mono px-2 py-1 rounded bg-[#080D18] border border-[#1E2B42] text-emerald-400 outline-none"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {sug.content}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#1C273C]">
                  {/* Promotion Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => supportSuggestion(sug.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                        hasSupported
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold"
                          : "bg-[#080D18] border border-[#1E2B42] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{sug.supports.length} Support</span>
                    </button>

                    <button
                      onClick={() => convertSuggestionToIdea(sug.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#131E30] hover:bg-[#1A2840] border border-[#223554] text-cyan-300 text-xs font-mono flex items-center gap-1 transition-colors"
                      title="Promote to full Vault Idea"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                      <span>To Idea</span>
                    </button>

                    <button
                      onClick={() => convertSuggestionToTask(sug.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#131E30] hover:bg-[#1A2840] border border-[#223554] text-purple-300 text-xs font-mono flex items-center gap-1 transition-colors"
                      title="Promote to Kanban Task"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                      <span>To Task</span>
                    </button>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      {author && (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{author ? author.name : "Member"}</span>
                    </div>
                    <span>{formatDate(sug.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
