"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  Trophy,
  Plus,
  Calendar,
  Sparkles,
  Zap,
  Target,
  BatteryCharging,
  Radio,
  Users,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export const AchievementsView: React.FC = () => {
  const { achievements, addAchievement, currentMember } = useTeam();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00F0FF", "#10B981", "#F59E0B", "#A855F7"],
      });
    } catch {
      // Ignore if unavailable
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAchievement(title.trim(), desc.trim(), "Trophy");
    triggerConfetti();

    setIsAdding(false);
    setTitle("");
    setDesc("");
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-5 h-5 text-amber-400" />;
      case "Target":
        return <Target className="w-5 h-5 text-red-400" />;
      case "BatteryCharging":
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case "Radio":
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case "Users":
        return <Users className="w-5 h-5 text-purple-400" />;
      default:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Team Achievements Timeline
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono font-semibold">
              {achievements.length} Unlocked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Celebrating key hardware milestones unlocked together by Byte Builders.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAdding ? "Cancel" : "Record Achievement"}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-2xl bg-[#0D1524] border border-amber-500/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 font-mono uppercase">
              Record New Hackathon Milestone
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Recorded by: {currentMember.name}
            </span>
          </div>

          <input
            type="text"
            required
            placeholder="Achievement Title (e.g. Survived 1.5m Drop Test with Zero Crack)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-amber-400"
          />

          <textarea
            required
            rows={3}
            placeholder="Details of the breakthrough or testing validation..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-amber-400"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-xs font-mono"
            >
              Unlock Achievement 🎉
            </button>
          </div>
        </form>
      )}

      {/* Achievement Cards Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="hardware-card rounded-2xl p-5 border border-[#1C273C] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-[#080D18] border border-[#1C273C] group-hover:border-amber-500/30 transition-colors">
                  {getIcon(ach.icon)}
                </div>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{ach.unlockedAt}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-3 group-hover:text-amber-300 transition-colors">
                {ach.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {ach.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1C273C] flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                ✓ Unlocked
              </span>
              <button
                onClick={triggerConfetti}
                className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Celebrate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
