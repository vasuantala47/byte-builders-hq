"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  FileCheck2,
  Plus,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const DecisionsView: React.FC = () => {
  const { decisions, currentMember, recordDecision } = useTeam();

  const [isRecording, setIsRecording] = useState(false);
  const [decNumber, setDecNumber] = useState(`ADR-0${decisions.length + 1}`);
  const [title, setTitle] = useState("");
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [alternatives, setAlternatives] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !decision.trim()) return;

    recordDecision({
      decisionNumber: decNumber,
      title: title.trim(),
      decision: decision.trim(),
      reason: reason.trim(),
      alternatives: alternatives.trim() || "None evaluated",
      decisionMadeBy: "Team Consensus (6/6)",
      status: "Accepted",
    });

    setIsRecording(false);
    setTitle("");
    setDecision("");
    setReason("");
    setAlternatives("");
    setDecNumber(`ADR-0${decisions.length + 2}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-red-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Technical Decision Log (ADRs)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 font-mono font-semibold">
              {decisions.length} Architecture Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Permanent records of engineering choices, trade-offs, and alternatives considered by the 6 team members.
          </p>
        </div>

        <button
          onClick={() => setIsRecording(!isRecording)}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isRecording ? "Cancel" : "Record New ADR"}</span>
        </button>
      </div>

      {/* New ADR Form */}
      {isRecording && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl bg-[#0D1524] border border-red-500/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 font-mono uppercase">
              Formalize Architectural Decision Record
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Recording as {currentMember.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                ADR #
              </label>
              <input
                type="text"
                value={decNumber}
                onChange={(e) => setDecNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none focus:border-red-400"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Decision Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Standardize on 400kHz Fast-Mode I2C Bus with 4.7k Pull-Ups"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              The Decision *
            </label>
            <textarea
              required
              rows={2}
              placeholder="State exactly what hardware/firmware approach was agreed upon..."
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-red-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Reason & Rationale *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Why is this chosen? (e.g., lower noise, power efficiency, pin compatibility)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Alternatives Considered
              </label>
              <textarea
                rows={3}
                placeholder="What other chips, protocols, or designs were reviewed and rejected? Why?"
                value={alternatives}
                onChange={(e) => setAlternatives(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs font-mono"
            >
              Commit Decision to Log
            </button>
          </div>
        </form>
      )}

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map((dec) => (
          <div
            key={dec.id}
            className="hardware-card rounded-2xl p-5 border border-[#1C273C] space-y-4 hover:border-red-500/40 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C273C]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                  {dec.decisionNumber}
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {dec.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{dec.decisionMadeBy}</span>
                </div>
                <span>•</span>
                <span>{dec.date}</span>
              </div>
            </div>

            {/* Decision Content */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                  Agreed Technical Path
                </span>
                <p className="text-slate-100 font-medium bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                  {dec.decision}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-mono text-emerald-400 uppercase font-semibold text-[10px] block mb-1">
                    Rationale & Engineering Justification
                  </span>
                  <p className="text-slate-300 bg-[#080D18] p-3 rounded-lg border border-emerald-500/20 leading-relaxed">
                    {dec.reason}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                    Alternatives Rejected
                  </span>
                  <p className="text-slate-300 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {dec.alternatives}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
