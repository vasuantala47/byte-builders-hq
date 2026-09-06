"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { TabType } from "@/types";
import {
  LayoutDashboard,
  Lightbulb,
  CheckSquare,
  Cpu,
  Plus,
  Menu,
  X,
  BookOpen,
  MessageSquareShare,
  FolderKanban,
  GitBranch,
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
  Share2,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsContributeOpen,
    setIsByteBotOpen,
    setIsShareOpen,
    currentMember,
  } = useTeam();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainBottomTabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "command-center", label: "Center", icon: LayoutDashboard },
    { id: "ideas", label: "Ideas", icon: Lightbulb },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "components", label: "Hardware", icon: Cpu },
  ];

  const allOtherTabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "research", label: "Research Hub", icon: BookOpen },
    { id: "suggestions", label: "Open Suggestions", icon: MessageSquareShare },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "roadmap", label: "Roadmap & Plans", icon: GitBranch },
    { id: "experiments", label: "Experiment Lab", icon: FlaskConical },
    { id: "prototypes", label: "Prototype Manager", icon: Layers },
    { id: "decisions", label: "Decision Log (ADRs)", icon: FileCheck2 },
    { id: "budget", label: "Budget Tracker", icon: DollarSign },
    { id: "chat", label: "Team Chat", icon: MessageCircle },
    { id: "activity", label: "Activity Feed", icon: Activity },
    { id: "wiki", label: "Knowledge Base", icon: BookMarked },
    { id: "files", label: "Files & Media", icon: FolderArchive },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "team", label: "Team Profiles", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0A0E18]/95 backdrop-blur-lg border-t border-[#1C273C] z-30 px-3 flex items-center justify-around">
        {mainBottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}

        {/* Floating Quick Contribute Button */}
        <button
          onClick={() => setIsContributeOpen(true)}
          className="flex flex-col items-center justify-center -mt-5"
          aria-label="Contribute"
        >
          <div className="w-11 h-11 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[9px] font-mono text-cyan-300 mt-0.5 font-bold">ADD</span>
        </button>

        {/* Drawer / More Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">More</span>
        </button>
      </div>

      {/* Full Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-4/5 max-w-sm bg-[#0A0E18] border-l border-[#1C273C] h-full flex flex-col p-4 animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C273C]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white font-mono text-sm">BYTE BUILDERS</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Launchers inside Drawer */}
            <div className="py-3 space-y-2">
              <button
                onClick={() => {
                  setIsByteBotOpen(true);
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Ask ByteBot AI</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Gemini</span>
              </button>

              <button
                onClick={() => {
                  setIsShareOpen(true);
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#141F32] border border-[#233554] text-cyan-300 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Connect & Share Link</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Real-Time</span>
              </button>
            </div>

            {/* Navigation Grid */}
            <div className="flex-1 overflow-y-auto space-y-1 py-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                All Workspace Hubs
              </div>
              {allOtherTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 font-semibold"
                        : "text-slate-300 hover:bg-[#131C2D]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Current Member Footer */}
            <div className="pt-3 border-t border-[#1C273C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={currentMember.avatar}
                  alt={currentMember.name}
                  className="w-7 h-7 rounded-md object-cover"
                />
                <div className="text-left">
                  <div className="text-xs text-white font-medium leading-none">{currentMember.name}</div>
                  <div className="text-[9px] font-mono text-cyan-400">{currentMember.callsign}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Online
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
