"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { Task, TaskStatus, TaskPriority } from "@/types";
import {
  CheckSquare,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  User,
  AlertCircle,
  MoreVertical,
  Check,
  Cpu,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const TasksView: React.FC = () => {
  const {
    tasks,
    members,
    currentMember,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    toggleTaskChecklist,
    setIsContributeOpen,
  } = useTeam();

  const [filterAssignee, setFilterAssignee] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);
  const [isDecomposingAI, setIsDecomposingAI] = useState<string | null>(null);

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: "BACKLOG", label: "Backlog", color: "border-slate-600 text-slate-400" },
    { id: "TODO", label: "To Do", color: "border-blue-500 text-blue-400" },
    { id: "IN PROGRESS", label: "In Progress", color: "border-cyan-400 text-cyan-400" },
    { id: "REVIEW", label: "Review", color: "border-amber-400 text-amber-400" },
    { id: "TESTING", label: "Testing", color: "border-purple-400 text-purple-400" },
    { id: "DONE", label: "Done", color: "border-emerald-400 text-emerald-400" },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesAssignee =
      filterAssignee === "All" || task.assigneeId === filterAssignee;
    const matchesPriority =
      filterPriority === "All" || task.priority === filterPriority;
    return matchesAssignee && matchesPriority;
  });

  // AI Task Breakdown with Gemini API
  const handleAiBreakdown = async (task: Task) => {
    setIsDecomposingAI(task.id);
    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
          type: "task_breakdown",
        }),
      });

      if (!res.ok) throw new Error("Failed to get AI breakdown");
      const data = await res.json();
      const raw = data.result || "";

      // Parse JSON array if possible or lines
      let items: string[] = [];
      try {
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          items = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fallback: split by lines
        items = raw
          .split("\n")
          .map((l: string) => l.replace(/^[0-9-.*]+\s*/, "").trim())
          .filter((l: string) => l.length > 3)
          .slice(0, 5);
      }

      if (items.length > 0) {
        const newChecklist = [
          ...task.checklist,
          ...items.map((text: string, i: number) => ({
            id: `ai_${Date.now()}_${i}`,
            text,
            done: false,
          })),
        ];
        updateTask(task.id, { checklist: newChecklist });
        if (activeTaskDetail?.id === task.id) {
          setActiveTaskDetail({ ...task, checklist: newChecklist });
        }
      }
    } catch (err) {
      console.error("AI breakdown error:", err);
    } finally {
      setIsDecomposingAI(null);
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "High":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Task System (Kanban)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
              {tasks.length} Hardware Tasks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Equal contributor task board. Any member can claim or assign tasks. Use Gemini AI to break tasks into hardware checklist items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContributeOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D1422] p-3 rounded-xl border border-[#1C273C]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 font-medium">Filter By:</span>

          {/* Assignee Filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-xs font-mono text-slate-200 outline-none"
          >
            <option value="All">All Assignees (6 Members)</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.callsign})
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-xs font-mono text-slate-200 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* 6-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-[#0A0E18] border border-[#1C273C] rounded-xl p-3 flex flex-col min-w-[240px] max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1C273C]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full border ${col.color}`} />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    {col.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#141F32] text-slate-400 font-semibold">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks in Column */}
              <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-600 font-mono italic">
                    Empty column
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = members.find((m) => m.id === task.assigneeId);
                    const doneChecklist = task.checklist.filter((c) => c.done).length;

                    return (
                      <div
                        key={task.id}
                        onClick={() => setActiveTaskDetail(task)}
                        className="p-3 rounded-lg bg-[#0E1524] border border-[#1C273C] hover:border-[#2E4166] cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow-md"
                      >
                        {/* Task Card Header */}
                        <div className="flex items-start justify-between gap-1.5">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold uppercase ${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          {/* Quick Status Shift Buttons */}
                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updateTaskStatus(task.id, e.target.value as TaskStatus)
                            }
                            className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#080D18] border border-[#1E2B42] text-slate-400 outline-none"
                          >
                            {columns.map((c) => (
                              <option key={c.id} value={c.id}>
                                → {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Checklist Progress if available */}
                        {task.checklist.length > 0 && (
                          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                            <span>Checklist</span>
                            <span className="text-cyan-400">
                              {doneChecklist}/{task.checklist.length}
                            </span>
                          </div>
                        )}

                        {/* Footer Assignee & AI Breakdown Trigger */}
                        <div className="pt-2 border-t border-[#182338] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <div className="flex items-center gap-1 truncate max-w-[110px]">
                            {assignee ? (
                              <>
                                <img
                                  src={assignee.avatar}
                                  alt={assignee.name}
                                  className="w-3.5 h-3.5 rounded-full object-cover"
                                />
                                <span className="truncate">{assignee.name.split(" ")[0]}</span>
                              </>
                            ) : (
                              <span className="italic text-slate-500">Unassigned</span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAiBreakdown(task);
                            }}
                            title="AI Hardware Breakdown"
                            disabled={isDecomposingAI === task.id}
                            className="p-1 rounded hover:bg-cyan-950 text-cyan-400/80 hover:text-cyan-300 transition-colors"
                          >
                            <Sparkles
                              className={`w-3.5 h-3.5 ${
                                isDecomposingAI === task.id ? "animate-spin text-cyan-300" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {activeTaskDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl bg-[#0E1524] border border-[#1E2E4A] rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1C273C]">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getPriorityBadge(
                    activeTaskDetail.priority
                  )}`}
                >
                  {activeTaskDetail.priority} Priority
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">
                  {activeTaskDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#080D18] p-3 rounded-lg border border-[#172236]">
              {activeTaskDetail.description || "No description provided."}
            </p>

            {/* Checklist with AI Breakdown Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Hardware Checklist ({activeTaskDetail.checklist.filter((c) => c.done).length}/
                  {activeTaskDetail.checklist.length})
                </span>
                <button
                  onClick={() => handleAiBreakdown(activeTaskDetail)}
                  disabled={isDecomposingAI === activeTaskDetail.id}
                  className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {isDecomposingAI === activeTaskDetail.id
                      ? "Decomposing with Gemini..."
                      : "AI Breakdown (Gemini)"}
                  </span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto bg-[#080D18] p-3 rounded-lg border border-[#172236]">
                {activeTaskDetail.checklist.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No checklist items yet. Click &quot;AI Breakdown&quot; to auto-generate steps!
                  </p>
                ) : (
                  activeTaskDetail.checklist.map((chk) => (
                    <label
                      key={chk.id}
                      className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={chk.done}
                        onChange={() => {
                          toggleTaskChecklist(activeTaskDetail.id, chk.id);
                          setActiveTaskDetail({
                            ...activeTaskDetail,
                            checklist: activeTaskDetail.checklist.map((c) =>
                              c.id === chk.id ? { ...c, done: !c.done } : c
                            ),
                          });
                        }}
                        className="w-4 h-4 rounded bg-[#0A0E18] border border-[#1E2B42] accent-cyan-400 cursor-pointer"
                      />
                      <span className={chk.done ? "line-through text-slate-500" : ""}>
                        {chk.text}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Assignee & Status */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  Assignee (Any Member)
                </label>
                <select
                  value={activeTaskDetail.assigneeId || ""}
                  onChange={(e) => {
                    const newId = e.target.value;
                    updateTask(activeTaskDetail.id, { assigneeId: newId });
                    setActiveTaskDetail({ ...activeTaskDetail, assigneeId: newId });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-xs font-mono text-slate-200 outline-none"
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
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  Kanban Status
                </label>
                <select
                  value={activeTaskDetail.status}
                  onChange={(e) => {
                    const st = e.target.value as TaskStatus;
                    updateTaskStatus(activeTaskDetail.id, st);
                    setActiveTaskDetail({ ...activeTaskDetail, status: st });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-xs font-mono text-cyan-400 outline-none"
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delete Task */}
            <div className="pt-3 border-t border-[#1C273C] flex items-center justify-between">
              <button
                onClick={() => {
                  deleteTask(activeTaskDetail.id);
                  setActiveTaskDetail(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>

              <button
                onClick={() => setActiveTaskDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-bold text-xs font-mono"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
