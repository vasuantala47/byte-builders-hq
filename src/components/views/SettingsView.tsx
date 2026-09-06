"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Key,
  Database,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const {
    teamCode,
    isDemoData,
    resetToDemoData,
    clearToCleanState,
    exportWorkspaceJson,
    importWorkspaceJson,
  } = useTeam();

  const [importJsonText, setImportJsonText] = useState("");
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleDownloadBackup = () => {
    const json = exportWorkspaceJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `byte-builders-hq-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const success = importWorkspaceJson(importJsonText.trim());
    setImportSuccess(success);
    if (success) {
      setTimeout(() => setImportSuccess(null), 3000);
      setImportJsonText("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Workspace Settings & Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure team access codes, switch between demo data and clean state, backup workspace JSON, and verify AI status.
          </p>
        </div>
      </div>

      {/* Demo Data & Workspace State Section */}
      <div className="hardware-card rounded-2xl p-5 border border-[#1C273C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Workspace Dataset Mode
            </h2>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
              isDemoData
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {isDemoData ? "Sample Demo Data Active" : "Clean Production Slate"}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Per competition guidelines, you can clear all sample data with one click to start entering your team&apos;s real-world hardware project, or reload the rich demonstration data (Project AeroPulse) anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to clear all data to an empty state? You can restore demo data anytime."
                )
              ) {
                clearToCleanState();
              }
            }}
            className="px-4 py-2 rounded-lg bg-[#141C2B] hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-mono font-semibold transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear to Clean Workspace (Zero Fake Data)</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Restore the complete AeroPulse hardware hackathon sample dataset?")) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Restore Full Demo Dataset</span>
          </button>
        </div>
      </div>

      {/* Team Invitation Code */}
      <div className="hardware-card rounded-2xl p-5 border border-[#1C273C] space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Team Workspace Access Code
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Only engineers with this code can join the Byte Builders HQ private workspace:
        </p>

        <div className="flex items-center gap-3 max-w-sm">
          <input
            type="text"
            readOnly
            value={teamCode}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-amber-400 font-mono text-xs font-bold outline-none select-all"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(teamCode);
              setCopiedKey(true);
              setTimeout(() => setCopiedKey(false), 2000);
            }}
            className="px-3 py-2 rounded-lg bg-[#131E30] hover:bg-[#1C2A44] border border-[#233758] text-xs font-mono text-slate-200 whitespace-nowrap"
          >
            {copiedKey ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>

      {/* JSON Backup Export & Restore */}
      <div className="hardware-card rounded-2xl p-5 border border-[#1C273C] space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Data Backup & Cross-Machine Sync
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Export your entire lab repository (ideas, tasks, components, test logs, decisions) into a standalone JSON file to share with teammates or keep offline backups.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Download Workspace JSON Backup</span>
          </button>
        </div>

        {/* Restore from JSON */}
        <form onSubmit={handleImportSubmit} className="pt-3 border-t border-[#1C273C] space-y-2">
          <label className="block text-xs font-mono text-slate-400">
            Restore / Import Workspace JSON:
          </label>
          <textarea
            rows={3}
            placeholder="Paste exported JSON string here to restore state..."
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none focus:border-cyan-400"
          />
          {importSuccess === true && (
            <p className="text-xs text-emerald-400 font-mono">
              ✓ Workspace successfully restored from backup!
            </p>
          )}
          {importSuccess === false && (
            <p className="text-xs text-red-400 font-mono">
              ✗ Invalid JSON format. Please verify the backup structure.
            </p>
          )}
          <button
            type="submit"
            disabled={!importJsonText.trim()}
            className="px-4 py-1.5 rounded-lg bg-[#141F32] hover:bg-[#1C2A44] disabled:opacity-40 border border-[#233554] text-cyan-300 text-xs font-mono transition-colors"
          >
            Import JSON Data
          </button>
        </form>
      </div>

      {/* AI Engineering Copilot Configuration */}
      <div className="hardware-card rounded-2xl p-5 border border-[#1C273C] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Embedded Gemini AI Copilot
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ByteBot is hooked up to Google Gemini models via server routes for pinout assistance, circuit review, and automatic task decomposition.
        </p>
        <div className="p-3 rounded-lg bg-[#080D18] border border-[#1C273C] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Target Models:</span>
          <span className="text-cyan-400 font-semibold">gemini-2.5-flash / gemini-2.5-pro</span>
        </div>
        <div className="p-3 rounded-lg bg-[#080D18] border border-[#1C273C] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Server Proxy:</span>
          <span className="text-emerald-400 font-semibold">/api/ai/chat & /api/ai/breakdown</span>
        </div>
      </div>
    </div>
  );
};
