"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  FolderKanban,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Cpu,
  FlaskConical,
  Layers,
  FileCheck2,
  Edit3,
  Check,
  Save,
  ArrowRight,
  GitBranch,
} from "lucide-react";

export const ProjectsView: React.FC = () => {
  const {
    project,
    updateProject,
    tasks,
    experiments,
    prototypes,
    components,
    decisions,
    setActiveTab,
  } = useTeam();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [objective, setObjective] = useState(project.objective);
  const [problem, setProblem] = useState(project.problem);
  const [solution, setSolution] = useState(project.solution);
  const [progress, setProgress] = useState(project.progress);

  const handleSave = () => {
    updateProject({
      title,
      objective,
      problem,
      solution,
      progress,
    });
    setIsEditing(false);
  };

  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const successfulExperiments = experiments.filter((e) => e.status === "Successful").length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Project Hub
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
              {project.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Central hardware initiative: linking architecture, tasks, physical prototyping, and tests.
          </p>
        </div>

        <div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-[#131E30] hover:bg-[#1A2840] border border-[#233554] text-slate-200 hover:text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit Project Spec</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Spec Card */}
      <div className="hardware-card rounded-2xl p-6 space-y-6">
        {/* Title & Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Mission Statement & Target
            </span>
            <span className="text-xs font-mono text-slate-400">
              Deadline: {project.deadline || "Hackathon Final Day"}
            </span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-cyan-500 text-white text-base font-bold outline-none"
            />
          ) : (
            <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
              {project.title}
            </h2>
          )}

          {/* Progress Slider or Display */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Overall Project Completion</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            {isEditing ? (
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            ) : (
              <div className="w-full bg-[#182438] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Objective */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Primary Engineering Objective</span>
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-cyan-500 text-white text-xs outline-none"
            />
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed bg-[#080D18] p-4 rounded-xl border border-[#172236]">
              {project.objective}
            </p>
          )}
        </div>

        {/* Problem vs Solution Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
              Problem & Technical Bottleneck
            </h4>
            {isEditing ? (
              <textarea
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-amber-500/50 text-white text-xs outline-none"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed bg-[#080D18] p-3.5 rounded-xl border border-[#172236]">
                {project.problem}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
              Selected Hardware Architecture & Solution
            </h4>
            {isEditing ? (
              <textarea
                rows={4}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-emerald-500/50 text-white text-xs outline-none"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed bg-[#080D18] p-3.5 rounded-xl border border-[#172236]">
                {project.solution}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Linked Ecosystem Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Linked Roadmap */}
        <button
          onClick={() => setActiveTab("roadmap")}
          className="p-4 rounded-xl bg-[#0D1422] border border-[#1C273C] hover:border-cyan-500/40 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-400 mb-2">
            <GitBranch className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-bold text-white block">Roadmap</span>
          <span className="text-[10px] font-mono text-slate-400">13 Stages Pipeline</span>
        </button>

        {/* Linked Tasks */}
        <button
          onClick={() => setActiveTab("tasks")}
          className="p-4 rounded-xl bg-[#0D1422] border border-[#1C273C] hover:border-emerald-500/40 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-bold text-white block">Tasks</span>
          <span className="text-[10px] font-mono text-slate-400">{completedTasks}/{tasks.length} Completed</span>
        </button>

        {/* Linked Experiments */}
        <button
          onClick={() => setActiveTab("experiments")}
          className="p-4 rounded-xl bg-[#0D1422] border border-[#1C273C] hover:border-purple-500/40 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-400 mb-2">
            <FlaskConical className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-bold text-white block">Experiments</span>
          <span className="text-[10px] font-mono text-slate-400">{successfulExperiments} Validated</span>
        </button>

        {/* Linked Prototypes */}
        <button
          onClick={() => setActiveTab("prototypes")}
          className="p-4 rounded-xl bg-[#0D1422] border border-[#1C273C] hover:border-orange-500/40 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-orange-400 mb-2">
            <Layers className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-bold text-white block">Prototypes</span>
          <span className="text-[10px] font-mono text-slate-400">{prototypes.length} Generations</span>
        </button>

        {/* Linked Components */}
        <button
          onClick={() => setActiveTab("components")}
          className="p-4 rounded-xl bg-[#0D1422] border border-[#1C273C] hover:border-cyan-500/40 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-400 mb-2">
            <Cpu className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-bold text-white block">Components</span>
          <span className="text-[10px] font-mono text-slate-400">{components.length} Bill of Materials</span>
        </button>
      </div>
    </div>
  );
};
