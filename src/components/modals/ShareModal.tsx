"use client";

import React, { useState, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  X,
  Share2,
  Copy,
  Check,
  Wifi,
  Globe,
  Users,
  Smartphone,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const ShareModal: React.FC = () => {
  const { isShareOpen, setIsShareOpen, members, teamCode } = useTeam();

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [origin, setOrigin] = useState("http://localhost:3000");
  const localLanIp = "10.237.193.109";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!isShareOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Direct auto-login links
  const directCurrentLink = `${origin}/?code=${teamCode}`;
  const directLanLink = `http://${localLanIp}:3000/?code=${teamCode}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-[#0B101C] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1C273C] flex items-center justify-between bg-[#080D17]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Connect Team & Share Lab Link
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Real-Time Multi-Device Sync • 6 Equal Innovators
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShareOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#131C2D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Real-time sync status indicator */}
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-emerald-300 font-semibold">
                Central Server Sync Active
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Live updates every 2s across devices
            </span>
          </div>

          {/* Option 1: Local Wi-Fi Network Link (Phones & Laptops in the Lab) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Same Wi-Fi / Lab Network Link (Phones & Laptops)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Auto-Login Included</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Anyone connected to the same Wi-Fi network can open this URL on their phone or laptop. Changes sync immediately:
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#080D18] border border-[#1E2E4A]">
              <input
                type="text"
                readOnly
                value={directLanLink}
                className="flex-1 bg-transparent text-cyan-300 font-mono text-xs outline-none select-all truncate"
              />
              <button
                onClick={() => copyToClipboard(directLanLink, "lan")}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)] flex-shrink-0"
              >
                {copiedType === "lan" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Option 2: Personalized Member Quick Links */}
          <div className="space-y-2 pt-2 border-t border-[#1C273C]">
            <span className="font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Personalized Member Links (Opens directly as that member)</span>
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Send each teammate their unique link. When they open it, the lab recognizes them immediately:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {members.map((m) => {
                const memberLink = `${origin}/?code=${teamCode}&member=${m.id}`;
                const isCopied = copiedType === m.id;

                return (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-[#0E1626] border border-[#1C273C] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {m.name}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400">
                          {m.callsign}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(memberLink, m.id)}
                      className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors flex-shrink-0 ${
                        isCopied
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-[#141E30] hover:bg-[#1A2840] text-slate-300 border border-[#223554]"
                      }`}
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Option 3: Public Internet Tunnel */}
          <div className="space-y-2 pt-2 border-t border-[#1C273C]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Share Globally over the Internet</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Worldwide
              </span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              To share with teammates outside your Wi-Fi network before deploying to Vercel, run this in your terminal to generate an instant free HTTPS tunnel:
            </p>

            <div className="p-2.5 rounded-xl bg-[#080D18] border border-[#1E2E4A] flex items-center justify-between gap-2">
              <code className="text-purple-300 font-mono text-xs">
                npx localtunnel --port 3000
              </code>
              <button
                onClick={() => copyToClipboard("npx localtunnel --port 3000", "tunnel")}
                className="text-[10px] px-2 py-1 rounded bg-[#131E30] hover:bg-[#1A2840] text-slate-300 font-mono flex items-center gap-1"
              >
                {copiedType === "tunnel" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === "tunnel" ? "Copied" : "Copy Command"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1C273C] bg-[#080D17] flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted with Team Code: {teamCode}</span>
          </div>
          <button
            onClick={() => setIsShareOpen(false)}
            className="px-3 py-1 rounded-lg bg-[#131C2D] text-slate-300 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
