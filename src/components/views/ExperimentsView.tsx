"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { Experiment, ExperimentStatus } from "@/types";
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const ExperimentsView: React.FC = () => {
  const {
    experiments,
    members,
    currentMember,
    updateExperimentStatus,
    setIsContributeOpen,
    setIsByteBotOpen,
  } = useTeam();

  const [filterMode, setFilterMode] = useState<"all" | "failures">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);

  const failedExperiments = experiments.filter(
    (e) => e.status === "Failed" || e.status === "Needs Improvement"
  );

  const baseList = filterMode === "failures" ? failedExperiments : experiments;

  const filtered = baseList.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.experimentNumber.toLowerCase().includes(q) ||
      e.hypothesis.toLowerCase().includes(q) ||
      e.conclusion.toLowerCase().includes(q) ||
      e.problems.toLowerCase().includes(q)
    );
  });

  const selectedExp = experiments.find((e) => e.id === selectedExpId) || filtered[0];

  const statuses: ExperimentStatus[] = [
    "Planned",
    "Running",
    "Successful",
    "Failed",
    "Needs Improvement",
  ];

  const getStatusBadge = (status: ExperimentStatus) => {
    switch (status) {
      case "Successful":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "Failed":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "Needs Improvement":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Running":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse";
      default:
        return "bg-slate-700/30 text-slate-400 border-slate-600";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Hardware Experiment Lab
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono font-semibold">
              {experiments.length} Test Protocols
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Physical test logs, scientific hypotheses, benchtop measurements, and searchable failure records.
          </p>
        </div>

        <button
          onClick={() => setIsContributeOpen(true)}
          className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Experiment</span>
        </button>
      </div>

      {/* Mode Selector & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#0C121F] p-1 rounded-xl border border-[#1C273C]">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterMode === "all"
                ? "bg-purple-500 text-white font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Protocols ({experiments.length})
          </button>
          <button
            onClick={() => setFilterMode("failures")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterMode === "failures"
                ? "bg-red-500/20 text-red-400 border border-red-500/40 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Failure & Lessons Library ({failedExperiments.length})</span>
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiments, hypotheses, measurements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs outline-none focus:border-purple-400 font-sans"
          />
        </div>
      </div>

      {/* Two-Column Experiment View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Test List */}
        <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0D1422] border border-[#1C273C] text-slate-500 text-xs font-mono">
              {filterMode === "failures"
                ? "No failed experiments logged! All tests currently passing."
                : "No experiments found."}
            </div>
          ) : (
            filtered.map((exp) => {
              const isSelected = selectedExp?.id === exp.id;
              const contributor = members.find((m) => m.id === exp.contributorId);

              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#141224] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      : "bg-[#0D1422] border-[#1C273C] hover:border-[#2C3852]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">
                      {exp.experimentNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getStatusBadge(
                        exp.status
                      )}`}
                    >
                      {exp.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {exp.conclusion || exp.hypothesis}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#182338] flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>By {contributor ? contributor.name.split(" ")[0] : "Member"}</span>
                    <span>{formatDate(exp.createdAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Full Protocol Dossier */}
        <div className="lg:col-span-7 bg-[#0D1422] border border-[#1C273C] rounded-xl p-5 overflow-y-auto max-h-[75vh] space-y-5">
          {selectedExp ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-[#1C273C]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">
                      {selectedExp.experimentNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getStatusBadge(
                        selectedExp.status
                      )}`}
                    >
                      {selectedExp.status}
                    </span>
                  </div>

                  {/* Status Toggle */}
                  <select
                    value={selectedExp.status}
                    onChange={(e) =>
                      updateExperimentStatus(selectedExp.id, e.target.value as ExperimentStatus)
                    }
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#080D18] border border-[#1E2B42] text-purple-300 outline-none"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <h2 className="text-base font-bold text-white leading-tight">
                  {selectedExp.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
                  <span>
                    Contributor: {members.find((m) => m.id === selectedExp.contributorId)?.name || "Member"}
                  </span>
                  <span>•</span>
                  <span>{formatDate(selectedExp.createdAt)}</span>
                </div>
              </div>

              {/* Scientific Breakdown */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Objective
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {selectedExp.objective}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-cyan-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Hypothesis
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-cyan-500/20 leading-relaxed font-mono">
                    {selectedExp.hypothesis}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      Benchtop Setup & Instruments
                    </h4>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-[#172236]">
                      {selectedExp.setup || "Bench multimeter and oscilloscope"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                      Components Under Test
                    </h4>
                    <div className="flex flex-wrap gap-1 bg-[#080D18] p-2.5 rounded-lg border border-[#172236]">
                      {selectedExp.componentsUsed.map((comp, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#131C2D] text-cyan-300 font-mono text-[10px]"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Measurements & Data */}
                <div>
                  <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Quantitative Measurements
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-emerald-500/20 font-mono text-xs">
                    {selectedExp.measurements}
                  </p>
                </div>

                {/* Problems & Lessons Learned */}
                {selectedExp.problems && (
                  <div>
                    <h4 className="font-mono text-red-400 uppercase tracking-wider font-semibold text-[11px] mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Problems Encountered / Failure Root Cause</span>
                    </h4>
                    <p className="text-slate-300 bg-red-950/20 p-3 rounded-lg border border-red-500/30 leading-relaxed">
                      {selectedExp.problems}
                    </p>
                  </div>
                )}

                {/* Conclusion */}
                <div>
                  <h4 className="font-mono text-purple-400 uppercase tracking-wider font-semibold text-[11px] mb-1">
                    Scientific Conclusion & Action
                  </h4>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed font-medium">
                    {selectedExp.conclusion}
                  </p>
                </div>

                {selectedExp.nextExperiment && (
                  <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-300 flex items-center justify-between">
                    <span className="font-mono">Next Test Protocol: {selectedExp.nextExperiment}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select an experiment protocol from the left to view data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
