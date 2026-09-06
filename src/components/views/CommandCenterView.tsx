"use client";

import React from "react";
import { useTeam } from "@/context/TeamContext";
import {
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Layers,
  Cpu,
  Lightbulb,
  BookOpen,
  Trophy,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const CommandCenterView: React.FC = () => {
  const {
    project,
    stages,
    tasks,
    ideas,
    research,
    experiments,
    prototypes,
    components,
    members,
    activityLogs,
    achievements,
    expenses,
    setActiveTab,
    setIsContributeOpen,
    setIsByteBotOpen,
    isDemoData,
  } = useTeam();

  // Current active roadmap stage
  const currentStage =
    stages.find((s) => s.status === "In Progress") ||
    stages.find((s) => s.status === "Pending") ||
    stages[0];

  // Next high-priority pending task
  const nextTask =
    tasks.find((t) => t.priority === "Critical" && t.status !== "DONE") ||
    tasks.find((t) => t.status === "TODO") ||
    tasks[0];

  // Missing components alert
  const missingComponents = components.filter(
    (c) => c.quantityRequired > c.quantityAvailable
  );

  // Active experiment
  const activeExp = experiments.find((e) => e.status === "Running" || e.status === "Planned");

  // Latest prototype
  const latestProto = prototypes[prototypes.length - 1];

  // Budget calculations
  const totalBudget = 150.0;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Demo Data Banner if active */}
      {isDemoData && (
        <div className="px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Sample Hardware Hackathon Dataset Loaded (Project AeroPulse)</span>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className="text-[11px] text-cyan-400 hover:text-cyan-200 underline font-mono"
          >
            Clear or customize in Settings →
          </button>
        </div>
      )}

      {/* Hero: 4 Core Questions Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Question 1: What are we building? */}
        <div className="hardware-card rounded-xl p-4 border-l-4 border-l-cyan-400 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                1. What Are We Building?
              </span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-sm font-bold text-white leading-snug line-clamp-2">
              {project.title}
            </h2>
            <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
              {project.objective}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C273C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">
              Status: <span className="text-cyan-300 font-semibold">{project.status}</span>
            </span>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Question 2: Where are we now? */}
        <div className="hardware-card rounded-xl p-4 border-l-4 border-l-emerald-400 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                2. Where Are We Now?
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-white">
                {project.progress}%
              </span>
              <span className="text-xs text-slate-400 font-mono">Stage {currentStage?.order || 1}/13</span>
            </div>
            <div className="w-full bg-[#182438] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium truncate">
              Phase: {currentStage?.name || "Sprint Initiation"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              Prototype: {latestProto ? latestProto.version.split("(")[0] : "V0 Benchtop"}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C273C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">
              Budget: ${totalSpent.toFixed(0)} / ${totalBudget.toFixed(0)}
            </span>
            <button
              onClick={() => setActiveTab("roadmap")}
              className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Roadmap <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Question 3: What happened recently? */}
        <div className="hardware-card rounded-xl p-4 border-l-4 border-l-amber-400 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                3. What Happened Recently?
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-2 mt-1">
              {activityLogs.slice(0, 2).map((act) => (
                <div key={act.id} className="text-xs text-slate-300 leading-snug">
                  <p className="line-clamp-2">{act.description}</p>
                  <span className="text-[10px] font-mono text-slate-500">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C273C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">
              {activityLogs.length} events logged
            </span>
            <button
              onClick={() => setActiveTab("activity")}
              className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Feed <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Question 4: What should we do next? */}
        <div className="hardware-card rounded-xl p-4 border-l-4 border-l-purple-400 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold">
                4. What Should We Do Next?
              </span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            {nextTask ? (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold">
                    {nextTask.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Deadline: {nextTask.deadline || "ASAP"}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-2">
                  {nextTask.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {nextTask.description}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">All immediate tasks completed!</p>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-[#1C273C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">Kanban Board</span>
            <button
              onClick={() => setActiveTab("tasks")}
              className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View Tasks <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Strip & Missing Components Alert */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0D1422] border border-[#1C273C]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              Hardware Innovation Controls
            </h3>
            <p className="text-xs text-slate-400">
              6 equal innovators collaborating on embedded hardware, firmware, and physical prototyping.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsByteBotOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask ByteBot AI</span>
          </button>
          <button
            onClick={() => setIsContributeOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Contribute</span>
          </button>
        </div>
      </div>

      {/* Missing Hardware Components Alert Box if any */}
      {missingComponents.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                Hardware Sourcing Alert ({missingComponents.length} parts needed)
              </h4>
              <button
                onClick={() => setActiveTab("components")}
                className="text-xs text-amber-400 hover:text-amber-200 underline font-mono"
              >
                Inspect Inventory →
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {missingComponents.map((c) => (
                <span
                  key={c.id}
                  className="text-[11px] px-2.5 py-1 rounded bg-[#161D2B] border border-amber-500/30 text-slate-200 font-mono"
                >
                  {c.name}: <strong className="text-amber-400">{c.quantityAvailable}</strong> on hand /{" "}
                  <strong>{c.quantityRequired}</strong> required
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Status Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Experiments & Test Rig */}
        <div className="hardware-card rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Hardware Experiment Lab
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("experiments")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                View all →
              </button>
            </div>

            {activeExp ? (
              <div className="p-3 rounded-lg bg-[#080D18] border border-[#1C273C] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                    {activeExp.experimentNumber}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold ${
                    activeExp.status === "Running" ? "text-cyan-400 animate-pulse" : "text-slate-400"
                  }`}>
                    {activeExp.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white line-clamp-2">
                  {activeExp.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Hypothesis: {activeExp.hypothesis}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active experiments running.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C273C] flex items-center justify-between text-xs text-slate-400">
            <span>Validated: {experiments.filter((e) => e.status === "Successful").length} tests</span>
            <span className="text-red-400 font-mono">
              Failures Logged: {experiments.filter((e) => e.status === "Failed").length}
            </span>
          </div>
        </div>

        {/* Prototype Evolution Status */}
        <div className="hardware-card rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Physical Prototype Status
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("prototypes")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                Timeline →
              </button>
            </div>

            {latestProto ? (
              <div className="p-3 rounded-lg bg-[#080D18] border border-[#1C273C] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-300 font-mono">
                    {latestProto.version}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300">
                    {latestProto.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Objective: {latestProto.objective}
                </p>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  Test Results: {latestProto.testResults}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No physical prototypes logged yet.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C273C] flex items-center justify-between text-xs text-slate-400">
            <span>Total Iterations: {prototypes.length}</span>
            <span className="text-emerald-400 font-mono">Ready for flight assembly</span>
          </div>
        </div>

        {/* 6 Equal Team Members Presence */}
        <div className="hardware-card rounded-xl p-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Team Presence (6 Innovators)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("team")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                View all →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded-lg bg-[#080D18] border border-[#1C273C] flex items-center gap-2"
                >
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-md object-cover"
                    />
                    {m.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {m.name.split(" ")[0]}
                    </div>
                    <div className="text-[9px] font-mono text-cyan-400 truncate">
                      {m.callsign}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C273C] flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-mono">
              {members.filter((m) => m.online).length}/6 in Lab
            </span>
            <span>Equal Contributors</span>
          </div>
        </div>
      </div>

      {/* Bottom Split: Recent Ideas & Recent Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ideas */}
        <div className="hardware-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Recent Ideas in Vault
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("ideas")}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
            >
              Open Vault ({ideas.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {ideas.slice(0, 3).map((idea) => (
              <div
                key={idea.id}
                onClick={() => setActiveTab("ideas")}
                className="p-3 rounded-lg bg-[#080D18] border border-[#1C273C] hover:border-[#2C3E60] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-colors truncate pr-2">
                    {idea.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/30">
                    {idea.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {idea.proposedSolution}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Hardware: {idea.requiredHardware || "N/A"}</span>
                  <span>{idea.upvotes.length} team votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Research Hub */}
        <div className="hardware-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Latest Research & Datasheets
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("research")}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
            >
              Research Hub ({research.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {research.slice(0, 3).map((res) => (
              <div
                key={res.id}
                onClick={() => setActiveTab("research")}
                className="p-3 rounded-lg bg-[#080D18] border border-[#1C273C] hover:border-[#2C3E60] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-colors truncate pr-2">
                    {res.title}
                  </span>
                  <span className="text-[10px] font-mono text-blue-400">
                    {res.topic}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {res.keyFindings}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{res.tags.join(" • ")}</span>
                  <span>{formatDate(res.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
