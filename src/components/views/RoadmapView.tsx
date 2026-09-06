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
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { generateId } from "@/lib/utils";

export const RoadmapView: React.FC = () => {
  const {
    stages,
    members,
    updateStageStatus,
    toggleStageChecklist,
    addStage,
    updateStage,
    deleteStage,
    addStageChecklistItem,
    deleteStageChecklistItem,
    project,
  } = useTeam();

  // Expanded stage for viewing/editing tasks
  const [expandedStageId, setExpandedStageId] = useState<string | null>(
    stages.find((s) => s.status === "In Progress")?.id || stages[0]?.id || null
  );

  // Modals
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [editingStage, setEditingStage] = useState<RoadmapStage | null>(null);

  // Add Stage state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newOwnerId, setNewOwnerId] = useState(members[0]?.id || "");
  const [newStatus, setNewStatus] = useState<RoadmapStage["status"]>("Pending");
  const [newChecklistText, setNewChecklistText] = useState("");

  // Edit Stage state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editOwnerId, setEditOwnerId] = useState("");
  const [editStatus, setEditStatus] = useState<RoadmapStage["status"]>("Pending");

  // Inline checklist input state per stage
  const [quickTaskText, setQuickTaskText] = useState<{ [stageId: string]: string }>({});

  const completedStagesCount = stages.filter((s) => s.status === "Completed").length;
  const progressPercent = stages.length > 0 ? Math.round((completedStagesCount / stages.length) * 100) : 0;

  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const initialChecklist = newChecklistText
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => ({ id: generateId("chk"), text: t, done: false }));

    addStage({
      order: stages.length + 1,
      name: newName.trim(),
      description: newDesc.trim() || "Milestone deliverable",
      deadline: newDeadline || undefined,
      ownerId: newOwnerId || undefined,
      status: newStatus,
      checklist:
        initialChecklist.length > 0
          ? initialChecklist
          : [{ id: generateId("chk"), text: "Initial milestone kickoff", done: false }],
    });

    setIsAddingStage(false);
    setNewName("");
    setNewDesc("");
    setNewDeadline("");
    setNewChecklistText("");
  };

  const openEditModal = (stage: RoadmapStage) => {
    setEditingStage(stage);
    setEditName(stage.name);
    setEditDesc(stage.description);
    setEditDeadline(stage.deadline || "");
    setEditOwnerId(stage.ownerId || "");
    setEditStatus(stage.status);
  };

  const handleSaveEditStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage || !editName.trim()) return;

    updateStage(editingStage.id, {
      name: editName.trim(),
      description: editDesc.trim(),
      deadline: editDeadline || undefined,
      ownerId: editOwnerId || undefined,
      status: editStatus,
    });

    setEditingStage(null);
  };

  const handleAddQuickTask = (stageId: string) => {
    const text = quickTaskText[stageId];
    if (!text || !text.trim()) return;

    addStageChecklistItem(stageId, text.trim());
    setQuickTaskText((prev) => ({ ...prev, [stageId]: "" }));
  };

  const getStatusBadge = (status: RoadmapStage["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Completed</span>
          </span>
        );
      case "In Progress":
        return (
          <span className="badge-pill bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="badge-pill bg-slate-800 text-slate-400 border border-slate-700/60">
            <Circle className="w-3 h-3" />
            <span>Upcoming</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Project Roadmap & Milestones
            </h1>
            <span className="badge-pill bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {completedStagesCount} of {stages.length} Milestones Done
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track your hackathon sprint from concept design to physical testing. Add, edit, or delete stages anytime.
          </p>
        </div>

        <button
          onClick={() => setIsAddingStage(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Milestone Stage</span>
        </button>
      </div>

      {/* Progress Bar Overview */}
      <div className="hardware-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-400">Overall Hackathon Progress</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white tracking-tight">{progressPercent}%</span>
            <span className="text-xs text-cyan-400 font-medium">
              Current Focus: {stages.find((s) => s.status === "In Progress")?.name || "Ready to launch"}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full sm:max-w-md bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline Stages List */}
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const isExpanded = expandedStageId === stage.id;
          const owner = members.find((m) => m.id === stage.ownerId);
          const doneTasks = stage.checklist.filter((c) => c.done).length;
          const totalTasks = stage.checklist.length;
          const taskPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={stage.id}
              className={`hardware-card transition-all duration-200 ${
                stage.status === "In Progress"
                  ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                  : "border-slate-800"
              }`}
            >
              {/* Card Header / Summary Row */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 flex-1 cursor-pointer" onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white tracking-tight hover:text-cyan-300 transition-colors">
                        {stage.name}
                      </h3>
                      {getStatusBadge(stage.status)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{stage.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                      {stage.deadline && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Target: {stage.deadline}</span>
                        </div>
                      )}

                      {owner && (
                        <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-0.5 rounded-full text-slate-300">
                          <img
                            src={owner.avatar}
                            alt={owner.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-medium">{owner.name}</span>
                        </div>
                      )}

                      <span className="text-[11px] text-slate-500">
                        {doneTasks} of {totalTasks} tasks done ({taskPercent}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Status Toggle Quick Selector */}
                  <select
                    value={stage.status}
                    onChange={(e) =>
                      updateStageStatus(
                        stage.id,
                        e.target.value as "Pending" | "In Progress" | "Completed"
                      )
                    }
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 outline-none hover:border-slate-600 transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => openEditModal(stage)}
                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                    title="Edit stage details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete milestone stage "${stage.name}"?`)) {
                        deleteStage(stage.id);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete stage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title={isExpanded ? "Collapse tasks" : "Expand tasks"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Checklist Drawer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 bg-slate-950/40 rounded-b-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Stage Action Items & Deliverables ({doneTasks}/{totalTasks})
                    </span>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    {stage.checklist.map((chk) => (
                      <div
                        key={chk.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-colors group"
                      >
                        <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={chk.done}
                            onChange={() => toggleStageChecklist(stage.id, chk.id)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-0 cursor-pointer"
                          />
                          <span
                            className={`text-xs ${
                              chk.done ? "line-through text-slate-500" : "text-slate-200"
                            }`}
                          >
                            {chk.text}
                          </span>
                        </label>

                        <button
                          onClick={() => deleteStageChecklistItem(stage.id, chk.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove task"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add Task Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add an action item (e.g. 'Order revision 2 PCB from JLCPCB')..."
                      value={quickTaskText[stage.id] || ""}
                      onChange={(e) =>
                        setQuickTaskText((prev) => ({ ...prev, [stage.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddQuickTask(stage.id);
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddQuickTask(stage.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-semibold transition-colors shrink-0"
                    >
                      + Add Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Milestone Modal */}
      {isAddingStage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Add New Roadmap Milestone</h3>
              </div>
              <button
                onClick={() => setIsAddingStage(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStage} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Field Validation & Environmental Chamber Testing"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Description & Goal
                </label>
                <textarea
                  rows={2}
                  placeholder="What does success look like for this phase?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Lead Contributor
                  </label>
                  <select
                    value={newOwnerId}
                    onChange={(e) => setNewOwnerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.callsign})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as RoadmapStage["status"])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Initial Checklist Tasks (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Calibrate gas sensor baseline
Verify LoRa packet ACK under 2 seconds
Record thermal camera telemetry`}
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingStage(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Milestone Modal */}
      {editingStage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Edit Milestone Stage</h3>
              </div>
              <button
                onClick={() => setEditingStage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStage} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Lead Contributor
                  </label>
                  <select
                    value={editOwnerId}
                    onChange={(e) => setEditOwnerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.callsign})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as RoadmapStage["status"])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete milestone "${editingStage.name}"?`)) {
                      deleteStage(editingStage.id);
                      setEditingStage(null);
                    }
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Milestone</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStage(null)}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
