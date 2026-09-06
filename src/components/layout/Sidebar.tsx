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
      title: "Core Workspace",
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
        { id: "projects", label: "Projects Hub", icon: FolderKanban },
        { id: "roadmap", label: "Plans & Roadmap", icon: GitBranch },
        {
          id: "tasks",
          label: "Tasks Board",
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
        },
      ],
    },
    {
      title: "Hardware Lab",
      items: [
        {
          id: "components",
          label: "Components & Stock",
          icon: Cpu,
          badge: missingComponentsCount > 0 ? `${missingComponentsCount} Need` : undefined,
          badgeColor: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
        },
        {
          id: "experiments",
          label: "Experiment Lab",
          icon: FlaskConical,
          badge: runningExperimentsCount > 0 ? `${runningExperimentsCount} Active` : undefined,
          badgeColor: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
        },
        { id: "prototypes", label: "Prototypes Timeline", icon: Layers },
        { id: "decisions", label: "Decision Log (ADR)", icon: FileCheck2 },
        { id: "budget", label: "Budget & Expenses", icon: DollarSign },
      ],
    },
    {
      title: "Team & Knowledge",
      items: [
        { id: "chat", label: "Team Chat", icon: MessageCircle },
        { id: "activity", label: "Activity Stream", icon: Activity },
        { id: "wiki", label: "Knowledge Base", icon: BookMarked },
        { id: "files", label: "Files & Media", icon: FolderArchive },
        { id: "achievements", label: "Achievements", icon: Trophy },
        { id: "team", label: "Team Profiles", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-sm">BYTE BUILDERS</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-full font-bold">HQ</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[135px]">
              Hardware Innovation Lab
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Launcher */}
      <div className="p-3">
        <button
          onClick={() => setIsByteBotOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-900/80 hover:from-cyan-950/30 hover:to-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white text-xs font-medium transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">ByteBot AI Copilot</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">
            Gemini
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-cyan-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.badgeColor ||
                        (isActive
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "bg-slate-800 text-slate-400")
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
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F17]">
        <button
          onClick={() => setActiveTab("team")}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all text-left"
        >
          <div className="relative">
            <img
              src={currentMember.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={currentMember.name}
              className="w-8 h-8 rounded-xl object-cover border border-slate-700"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {currentMember.name}
              </p>
              <span className="text-[10px] font-bold text-cyan-400">
                {currentMember.callsign}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Equal Contributor
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};
