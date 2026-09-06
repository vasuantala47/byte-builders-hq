"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { RoadmapStage } from "@/types";
import {
  GitBranch,
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  User,
  ArrowDown,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateId } from "@/lib/utils";

export const RoadmapView: React.FC = () => {
  const { stages, members, updateStageStatus, toggleStageChecklist, updateProject, project } = useTeam();

  const [expandedStageId, setExpandedStageId] = useState<string | null>(stages[7]?.id || stages[0]?.id);
  const [newStageName, setNewStageName] = useState("");
  const [newStageDesc, setNewStageDesc] = useState("");
  const [isAddingStage, setIsAddingStage] = useState(false);

  const completedStagesCount = stages.filter((s) => s.status === "Completed").length;
  const progressPercent = Math.round((completedStagesCount / stages.length) * 100);

  const handleAddCustomStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: RoadmapStage = {
      id: generateId("stage"),
      order: stages.length + 1,
      name: newStageName.trim(),
      description: newStageDesc.trim() || "Custom team milestone",
      status: "Pending",
      checklist: [{ id: generateId("chk"), text: "Define deliverables", done: false }],
    };

    // We can update stages via project or context
    setIsAddingStage(false);
    setNewStageName("");
    setNewStageDesc("");
  };

  const getStatusIcon = (status: RoadmapStage["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "In Progress":
        return <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Plans & Visual Roadmap
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
              {completedStagesCount} / {stages.length} Milestones Complete
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual engineering pipeline: from Problem Understanding through Prototype iterations to Final Presentation & Submission.
          </p>
        </div>

        <button
          onClick={() => setIsAddingStage(!isAddingStage)}
          className="px-4 py-2 rounded-lg bg-[#131E30] hover:bg-[#1A2840] border border-[#233554] text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Add Custom Stage</span>
        </button>
      </div>

      {/* Progress Metric Bar */}
      <div className="hardware-card rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400">Total Hackathon Sprint Evolution</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-black text-white font-mono">{progressPercent}%</span>
            <span className="text-xs font-mono text-cyan-400">
              Active Phase: {stages.find((s) => s.status === "In Progress")?.name || "Ready"}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full sm:max-w-md bg-[#182438] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Custom Stage Form Modal / Box */}
      {isAddingStage && (
        <form
          onSubmit={handleAddCustomStage}
          className="p-4 rounded-xl bg-[#0D1524] border border-cyan-500/40 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
              Add Custom Roadmap Milestone
            </span>
            <button
              type="button"
              onClick={() => setIsAddingStage(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Milestone Name (e.g., Drone Flight Tether Stress Test)"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Short Description of Milestone Objectives"
              value={newStageDesc}
              onChange={(e) => setNewStageDesc(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-bold text-xs font-mono"
          >
            Append to Pipeline
          </button>
        </form>
      )}

      {/* Interactive Step-by-Step Pipeline Timeline */}
      <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#182438]">
        {stages.map((stage, idx) => {
          const isExpanded = expandedStageId === stage.id;
          const owner = members.find((m) => m.id === stage.ownerId);

          return (
            <div key={stage.id} className="relative pl-12">
              {/* Timeline Icon Node */}
              <div
                onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                className={`absolute left-4 top-4 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  stage.status === "Completed"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : stage.status === "In Progress"
                    ? "bg-cyan-950 text-cyan-400 border border-cyan-500/60 shadow-[0_0_12px_rgba(0,240,255,0.4)] animate-pulse-slow"
                    : "bg-[#0E1522] text-slate-500 border border-[#1C273C]"
                }`}
              >
                {getStatusIcon(stage.status)}
              </div>

              {/* Stage Card */}
              <div
                className={`hardware-card rounded-xl p-4 transition-all ${
                  isExpanded
                    ? "border-cyan-500/40 bg-[#0F1728] shadow-lg"
                    : "bg-[#0D1422] hover:border-[#2C3E60]"
                }`}
              >
                <div
                  onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {String(stage.order).padStart(2, "0")}.
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {stage.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Changer */}
                    <select
                      value={stage.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateStageStatus(
                          stage.id,
                          e.target.value as "Pending" | "In Progress" | "Completed"
                        )
                      }
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                        stage.status === "Completed"
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40 font-bold"
                          : stage.status === "In Progress"
                          ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/40 font-bold"
                          : "bg-[#080D18] text-slate-400 border-[#1E2B42]"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <div className="text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Checklist & Notes */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#1C273C] space-y-4 text-xs animate-in fade-in">
                    <p className="text-slate-300 leading-relaxed">
                      {stage.description}
                    </p>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      {owner && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Owner: {owner.name} ({owner.callsign})</span>
                        </div>
                      )}
                      {stage.deadline && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Target: {stage.deadline}</span>
                        </div>
                      )}
                    </div>

                    {/* Checklist */}
                    {stage.checklist && stage.checklist.length > 0 && (
                      <div className="space-y-2 bg-[#080D18] p-3.5 rounded-xl border border-[#172236]">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                          Stage Engineering Deliverables
                        </span>
                        <div className="space-y-1.5 mt-1">
                          {stage.checklist.map((chk) => (
                            <label
                              key={chk.id}
                              className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer hover:text-white"
                            >
                              <input
                                type="checkbox"
                                checked={chk.done}
                                onChange={() => toggleStageChecklist(stage.id, chk.id)}
                                className="w-4 h-4 rounded bg-[#0A0E18] border border-[#1E2B42] accent-cyan-400 cursor-pointer"
                              />
                              <span className={chk.done ? "line-through text-slate-500" : ""}>
                                {chk.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {stage.notes && (
                      <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-200 text-xs font-mono">
                        Note: {stage.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
