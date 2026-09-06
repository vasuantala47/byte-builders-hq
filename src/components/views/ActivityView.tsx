"use client";

import React from "react";
import { useTeam } from "@/context/TeamContext";
import {
  Activity,
  Lightbulb,
  BookOpen,
  MessageSquareShare,
  CheckSquare,
  FlaskConical,
  Layers,
  Cpu,
  FileCheck2,
  Trophy,
  ArrowRight,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TabType } from "@/types";

export const ActivityView: React.FC = () => {
  const { activityLogs, members, setActiveTab } = useTeam();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "idea":
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case "research":
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case "suggestion":
        return <MessageSquareShare className="w-4 h-4 text-emerald-400" />;
      case "task":
        return <CheckSquare className="w-4 h-4 text-cyan-400" />;
      case "experiment":
        return <FlaskConical className="w-4 h-4 text-purple-400" />;
      case "prototype":
        return <Layers className="w-4 h-4 text-orange-400" />;
      case "component":
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case "decision":
        return <FileCheck2 className="w-4 h-4 text-red-400" />;
      case "achievement":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Activity & Audit Feed
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
              {activityLogs.length} Events
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time chronological timeline recording how the hardware product was conceived, tested, and built.
          </p>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="hardware-card rounded-2xl p-5 divide-y divide-[#182338]">
        {activityLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No activity logged yet.
          </div>
        ) : (
          activityLogs.map((act) => {
            const member = members.find((m) => m.id === act.memberId);

            return (
              <div
                key={act.id}
                className="py-3.5 flex items-start justify-between gap-3 first:pt-0 last:pb-0 hover:bg-[#080D18]/50 transition-colors px-2 rounded-lg"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#080D18] border border-[#1E2B42] mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>

                  <div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                      <span>{member ? member.name : "Member"}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(act.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {act.linkTab && (
                  <button
                    onClick={() => setActiveTab(act.linkTab as TabType)}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex-shrink-0 pt-1"
                  >
                    <span className="hidden sm:inline">View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
