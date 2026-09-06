"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { PrototypeVersion, PrototypeStatus } from "@/types";
import {
  Layers,
  Plus,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileCode,
} from "lucide-react";
import { generateId } from "@/lib/utils";

export const PrototypesView: React.FC = () => {
  const { prototypes, addPrototypeVersion, updatePrototypeStatus } = useTeam();

  const [isAdding, setIsAdding] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [objective, setObjective] = useState("");
  const [changes, setChanges] = useState("");
  const [components, setComponents] = useState("");
  const [testResults, setTestResults] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName.trim() || !objective.trim()) return;

    addPrototypeVersion({
      version: versionName.trim(),
      date: new Date().toISOString().split("T")[0],
      objective: objective.trim(),
      changes: changes.trim() || "Initial baseline",
      components: components.split(",").map((c) => c.trim()).filter(Boolean),
      designFiles: [],
      photos: photoUrl ? [photoUrl] : [],
      testResults: testResults.trim() || "Bench testing underway",
      problems: "None logged yet",
      improvements: "TBD",
      status: "In Design",
    });

    setIsAdding(false);
    setVersionName("");
    setObjective("");
    setChanges("");
    setComponents("");
    setTestResults("");
    setPhotoUrl("");
  };

  const statuses: PrototypeStatus[] = [
    "In Design",
    "Fabricating",
    "Testing",
    "Verified",
    "Superseded",
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Prototype Manager
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-300 font-mono font-semibold">
              {prototypes.length} Physical Iterations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Physical hardware evolution timeline: from solderless breadboard V0 through perfboard V1 to custom milled PCB V2.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAdding ? "Close Form" : "Log Prototype Version"}</span>
        </button>
      </div>

      {/* Add Version Modal Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-2xl bg-[#0D1524] border border-orange-500/40 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400 font-mono uppercase">
              Log New Physical Prototype Iteration
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Version Label (e.g. Prototype V3: Carbon Fiber Drone Sled)"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-orange-400"
            />
            <input
              type="text"
              required
              placeholder="Primary Engineering Objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-orange-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Key Changes from Previous Revision"
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-orange-400"
            />
            <input
              type="text"
              placeholder="Components Used (comma separated)"
              value={components}
              onChange={(e) => setComponents(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-orange-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Benchtop Test Results Summary"
              value={testResults}
              onChange={(e) => setTestResults(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-orange-400"
            />
            <input
              type="url"
              placeholder="Photo / Bench Image URL (optional)"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-orange-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs font-mono"
            >
              Add to Timeline
            </button>
          </div>
        </form>
      )}

      {/* Evolution Timeline */}
      <div className="space-y-6">
        {prototypes.map((proto, idx) => (
          <div
            key={proto.id}
            className="hardware-card rounded-2xl p-5 border border-[#1C273C] hover:border-orange-500/40 transition-all space-y-4"
          >
            {/* Version Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C273C]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold text-sm">
                  {idx}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                    {proto.version}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Fabricated: {proto.date}</span>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <select
                value={proto.status}
                onChange={(e) =>
                  updatePrototypeStatus(proto.id, e.target.value as PrototypeStatus)
                }
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#080D18] border border-[#1E2B42] text-orange-400 outline-none cursor-pointer"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Split Content: Specs + Bench Photo */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8 space-y-3 text-xs">
                <div>
                  <span className="font-mono text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                    Objective
                  </span>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {proto.objective}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-cyan-400 uppercase font-semibold text-[10px] block mb-1">
                    Changes from Previous Version
                  </span>
                  <p className="text-slate-200 bg-[#080D18] p-3 rounded-lg border border-[#172236] leading-relaxed">
                    {proto.changes}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-mono text-emerald-400 uppercase font-semibold text-[10px] block mb-1">
                      Test Results
                    </span>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-emerald-500/20">
                      {proto.testResults}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-amber-400 uppercase font-semibold text-[10px] block mb-1">
                      Problems & Next Fixes
                    </span>
                    <p className="text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-amber-500/20">
                      {proto.problems}
                    </p>
                  </div>
                </div>

                {/* Components Chips */}
                {proto.components && proto.components.length > 0 && (
                  <div>
                    <span className="font-mono text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                      Integrated Hardware
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proto.components.map((comp, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded bg-[#131C2D] border border-[#1E2B42] text-slate-300 font-mono text-[11px]"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Photo / Visual Media */}
              <div className="md:col-span-4 flex flex-col justify-center">
                {proto.photos && proto.photos.length > 0 ? (
                  <div className="rounded-xl overflow-hidden border border-[#1C273C] bg-[#080D18] group relative">
                    <img
                      src={proto.photos[0]}
                      alt={proto.version}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 bg-[#0A0E18]/90 text-[10px] font-mono text-slate-400 truncate text-center">
                      Physical Bench Photo
                    </div>
                  </div>
                ) : (
                  <div className="h-48 rounded-xl border border-dashed border-[#1C273C] bg-[#080D18] flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span>No photo uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
