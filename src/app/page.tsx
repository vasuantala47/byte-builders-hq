"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileNav } from "@/components/layout/MobileNav";

// Modals
import { ContributeModal } from "@/components/modals/ContributeModal";
import { ByteBotModal } from "@/components/modals/ByteBotModal";
import { UniversalSearchModal } from "@/components/modals/UniversalSearchModal";
import { ShareModal } from "@/components/modals/ShareModal";

// Views
import { CommandCenterView } from "@/components/views/CommandCenterView";
import { IdeasView } from "@/components/views/IdeasView";
import { ResearchView } from "@/components/views/ResearchView";
import { SuggestionsView } from "@/components/views/SuggestionsView";
import { ProjectsView } from "@/components/views/ProjectsView";
import { RoadmapView } from "@/components/views/RoadmapView";
import { TasksView } from "@/components/views/TasksView";
import { HardwareLabView } from "@/components/views/HardwareLabView";
import { ExperimentsView } from "@/components/views/ExperimentsView";
import { PrototypesView } from "@/components/views/PrototypesView";
import { DecisionsView } from "@/components/views/DecisionsView";
import { KnowledgeBaseView } from "@/components/views/KnowledgeBaseView";
import { TeamChatView } from "@/components/views/TeamChatView";
import { ActivityView } from "@/components/views/ActivityView";
import { BudgetView } from "@/components/views/BudgetView";
import { AchievementsView } from "@/components/views/AchievementsView";
import { FilesView } from "@/components/views/FilesView";
import { TeamView } from "@/components/views/TeamView";
import { SettingsView } from "@/components/views/SettingsView";

import { Cpu, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { activeTab, isAuthenticated, loginWithCode } = useTeam();
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // Authentication Barrier if not authenticated
  if (!isAuthenticated) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const ok = loginWithCode(accessCodeInput);
      if (!ok) {
        setAuthError(true);
      }
    };

    return (
      <div className="min-h-screen bg-[#080B11] bg-grid-circuit flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0D1422] border border-[#1C273C] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in">
          <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Cpu className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-wider font-mono">
                BYTE BUILDERS
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold">
                HQ
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Private Digital Hardware Innovation Lab
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-left text-xs font-mono text-slate-300 mb-1.5">
                Team Access Code
              </label>
              <input
                type="text"
                required
                placeholder="Enter BYTE-BUILDERS-2025..."
                value={accessCodeInput}
                onChange={(e) => {
                  setAccessCodeInput(e.target.value);
                  setAuthError(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none focus:border-cyan-400 text-center uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
              />
              {authError && (
                <p className="text-[11px] text-red-400 mt-1 font-mono text-left">
                  Invalid access code. Please use: BYTE-BUILDERS-2025
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
              <span>Enter Innovation Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#1C273C] text-[11px] text-slate-500 font-mono">
            <span>Restricted to Byte Builders 6-member hackathon team</span>
          </div>
        </div>
      </div>
    );
  }

  // Render current active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case "command-center":
        return <CommandCenterView />;
      case "ideas":
        return <IdeasView />;
      case "research":
        return <ResearchView />;
      case "suggestions":
        return <SuggestionsView />;
      case "projects":
        return <ProjectsView />;
      case "roadmap":
        return <RoadmapView />;
      case "tasks":
        return <TasksView />;
      case "components":
      case "hardware":
        return <HardwareLabView />;
      case "experiments":
        return <ExperimentsView />;
      case "prototypes":
        return <PrototypesView />;
      case "decisions":
        return <DecisionsView />;
      case "wiki":
        return <KnowledgeBaseView />;
      case "chat":
        return <TeamChatView />;
      case "activity":
        return <ActivityView />;
      case "budget":
        return <BudgetView />;
      case "achievements":
        return <AchievementsView />;
      case "files":
        return <FilesView />;
      case "team":
        return <TeamView />;
      case "settings":
        return <SettingsView />;
      default:
        return <CommandCenterView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex">
      {/* Desktop Sidebar (Left) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 lg:ml-64 flex flex-col min-h-screen">
        <TopNavbar />

        <main className="flex-1 pt-16 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* Global Interactive Modals */}
      <ContributeModal />
      <ByteBotModal />
      <UniversalSearchModal />
      <ShareModal />
    </div>
  );
}
