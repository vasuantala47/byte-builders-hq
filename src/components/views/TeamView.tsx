"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { TeamMember } from "@/types";
import {
  Users,
  Edit3,
  Check,
  Save,
  Lightbulb,
  BookOpen,
  CheckSquare,
  Shield,
  Sparkles,
} from "lucide-react";

export const TeamView: React.FC = () => {
  const {
    members,
    currentMember,
    setCurrentMemberId,
    updateMemberProfile,
    ideas,
    research,
    suggestions,
    tasks,
  } = useTeam();

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [callsign, setCallsign] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleStartEdit = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setName(m.name);
    setCallsign(m.callsign);
    setBio(m.bio);
    setSkills(m.skills.join(", "));
    setAvatar(m.avatar);
  };

  const handleSave = (id: string) => {
    updateMemberProfile(id, {
      name: name.trim(),
      callsign: callsign.trim(),
      bio: bio.trim(),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      avatar: avatar.trim(),
    });
    setEditingMemberId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Byte Builders Team Profiles
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
              6 Equal Contributors
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every member is an equal partner in innovation. No rigid corporate hierarchy. Switch your active session or customize your profile.
          </p>
        </div>
      </div>

      {/* 6 Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const isMe = member.id === currentMember.id;
          const isEditing = editingMemberId === member.id;

          const memberIdeas = ideas.filter((i) => i.authorId === member.id).length;
          const memberResearch = research.filter((r) => r.authorId === member.id).length;
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id).length;

          return (
            <div
              key={member.id}
              className={`hardware-card rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                isMe
                  ? "border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.12)] bg-[#0E1729]"
                  : "border-[#1C273C] hover:border-[#2C3E60]"
              }`}
            >
              {/* Profile Top */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={member.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#223554]"
                    />
                    {member.online && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0E18]" />
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {isMe ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                        Active You
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentMemberId(member.id)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131E30] hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-[#1E2B42] transition-colors"
                      >
                        Switch to This Member
                      </button>
                    )}

                    <button
                      onClick={() => (isEditing ? handleSave(member.id) : handleStartEdit(member))}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Edit3 className="w-3 h-3 text-cyan-400" />
                      <span>{isEditing ? "Done" : "Edit Bio"}</span>
                    </button>
                  </div>
                </div>

                {/* Profile Details or Edit Form */}
                {isEditing ? (
                  <div className="space-y-2.5 mt-3 animate-in fade-in">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-cyan-500 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400">Callsign</label>
                      <input
                        type="text"
                        value={callsign}
                        onChange={(e) => setCallsign(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-cyan-400 text-xs font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400">Bio</label>
                      <textarea
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-slate-300 text-xs outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleSave(member.id)}
                      className="w-full py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono transition-colors"
                    >
                      Save Profile
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {member.name}
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">
                        Callsign: &quot;{member.callsign}&quot;
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131C2D] border border-[#1E2B42] text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contribution Stats */}
              <div className="pt-3 border-t border-[#1C273C] grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[#080D18] border border-[#172236]">
                  <span className="text-xs font-bold text-white font-mono">{memberIdeas}</span>
                  <span className="block text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                    Ideas
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#080D18] border border-[#172236]">
                  <span className="text-xs font-bold text-white font-mono">{memberResearch}</span>
                  <span className="block text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                    Research
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#080D18] border border-[#172236]">
                  <span className="text-xs font-bold text-white font-mono">{memberTasks}</span>
                  <span className="block text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                    Tasks
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
