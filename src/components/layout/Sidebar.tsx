"use client";

import React from "react";
import { useTeam } from "@/context/TeamContext";
import { TabType } from "@/types";
import {
  LayoutDashboard,
  Lightbulb,
  BookOpen,
  MessageSquareShare,
  FolderKanban,
  GitBranch,
  CheckSquare,
  Cpu,
  FlaskConical,
  Layers,
  FileCheck2,
  DollarSign,
  MessageCircle,
  Activity,
  Trophy,
  FolderArchive,
  Users,
  Settings,
  BookMarked,
  Sparkles,
} from "lucide-react";

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    ideas,
    tasks,
    components,
    experiments,
    setIsByteBotOpen,
    currentMember,
  } = useTeam();

  const missingComponentsCount = components.filter(
    (c) => c.quantityRequired > c.quantityAvailable
  ).length;

  const runningExperimentsCount = experiments.filter(
    (e) => e.status === "Running"
  ).length;

  const pendingTasksCount = tasks.filter(
    (t) => t.status === "TODO" || t.status === "IN PROGRESS"
  ).length;

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: "INNOVATION ENGINE",
      items: [
        { id: "command-center", label: "Command Center", icon: LayoutDashboard },
        {
          id: "ideas",
          label: "Idea Vault",
          icon: Lightbulb,
          badge: ideas.length,
        },
        { id: "research", label: "Research Hub", icon: BookOpen },
        { id: "suggestions", label: "Open Suggestions", icon: MessageSquareShare },
        { id: "projects", label: "Projects", icon: FolderKanban },
        { id: "roadmap", label: "Plans & Roadmap", icon: GitBranch },
        {
          id: "tasks",
          label: "Tasks (Kanban)",
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
        },
      ],
    },
    {
      title: "HARDWARE LAB",
      items: [
        {
          id: "components",
          label: "Components & Stock",
          icon: Cpu,
          badge: missingComponentsCount > 0 ? `${missingComponentsCount} Need` : undefined,
          badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        },
        {
          id: "experiments",
          label: "Experiment Lab",
          icon: FlaskConical,
          badge: runningExperimentsCount > 0 ? `${runningExperimentsCount} Active` : undefined,
          badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        },
        { id: "prototypes", label: "Prototype Manager", icon: Layers },
        { id: "decisions", label: "Decision Log (ADR)", icon: FileCheck2 },
        { id: "budget", label: "Budget Tracker", icon: DollarSign },
      ],
    },
    {
      title: "COLLABORATION & KNOWLEDGE",
      items: [
        { id: "chat", label: "Team Chat", icon: MessageCircle },
        { id: "activity", label: "Activity Feed", icon: Activity },
        { id: "wiki", label: "Knowledge Base", icon: BookMarked },
        { id: "files", label: "Files & Media", icon: FolderArchive },
        { id: "achievements", label: "Achievements", icon: Trophy },
        { id: "team", label: "Team Profiles", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0A0E18] border-r border-[#1C273C] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1C273C] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-white text-sm">BYTE BUILDERS</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#00F0FF]/15 text-[#00F0FF] rounded font-mono font-semibold">HQ</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight truncate max-w-[135px]">
              Hardware Innovation Lab
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Launcher */}
      <div className="p-3">
        <button
          onClick={() => setIsByteBotOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 hover:text-cyan-200 text-xs font-mono transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-semibold tracking-wide">ByteBot AI Copilot</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono">
            Gemini
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono tracking-widest text-slate-500 font-semibold uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-semibold shadow-[0_0_10px_rgba(0,240,255,0.08)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#131C2D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#00F0FF]" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        item.badgeColor ||
                        (isActive
                          ? "bg-[#00F0FF]/20 text-[#00F0FF]"
                          : "bg-[#182438] text-slate-400")
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Active Member Presence Footer */}
      <div className="p-3 border-t border-[#1C273C] bg-[#0A0E18]">
        <button
          onClick={() => setActiveTab("team")}
          className="w-full flex items-center gap-3 p-2 rounded-lg bg-[#101726] border border-[#1C273C] hover:border-[#2C3E60] transition-all text-left"
        >
          <div className="relative">
            <img
              src={currentMember.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={currentMember.name}
              className="w-8 h-8 rounded-md object-cover border border-[#2A3C5C]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0E18]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {currentMember.name}
              </p>
              <span className="text-[10px] font-mono text-cyan-400">
                {currentMember.callsign}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              Equal Contributor
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};
