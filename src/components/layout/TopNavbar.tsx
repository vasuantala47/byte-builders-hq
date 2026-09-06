"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  ChevronDown,
  UserCheck,
  Check,
  Cpu,
  Menu,
  Share2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TopNavbarProps {
  onOpenMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    project,
    members,
    currentMember,
    setCurrentMemberId,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsContributeOpen,
    setIsSearchOpen,
    setIsByteBotOpen,
    setIsShareOpen,
    setActiveTab,
  } = useTeam();

  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const memberMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        memberMenuRef.current &&
        !memberMenuRef.current.contains(event.target as Node)
      ) {
        setIsMemberMenuOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-[#0A0E18]/90 backdrop-blur-md border-b border-[#1C273C] fixed top-0 left-0 lg:left-64 right-0 z-20 px-4 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Project Headline */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#131C2D]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-xs font-mono text-slate-300 font-medium">
            Active Project:
          </span>
          <button
            onClick={() => setActiveTab("projects")}
            className="text-xs font-semibold text-white hover:text-cyan-400 max-w-[200px] md:max-w-xs truncate transition-colors"
          >
            {project.title}
          </button>
        </div>
      </div>

      {/* Middle / Right: Actions & Universal Search */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Universal Search Bar Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E2B42] hover:border-[#2C3E60] text-slate-400 hover:text-slate-200 text-xs transition-all w-32 sm:w-48 md:w-64 group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="truncate">Search anything...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-[#1C273C] text-slate-400 px-1.5 py-0.5 rounded font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Ask ByteBot AI Quick Trigger */}
        <button
          onClick={() => setIsByteBotOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask AI</span>
        </button>

        {/* ＋ Contribute Button */}
        <button
          onClick={() => setIsContributeOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#38F4FF] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden xs:inline tracking-wide uppercase font-mono text-[11px]">
            Contribute
          </span>
        </button>

        {/* Share Lab Link Button */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141E30] hover:bg-[#1C2A42] border border-[#233758] hover:border-cyan-500/50 text-cyan-300 font-bold text-xs font-mono transition-all active:scale-95"
          title="Share live link to connect teammates"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline tracking-wide font-mono text-[11px]">
            Share Link
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#131C2D] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0A0E18] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0E1522] border border-[#1E2B42] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1C273C]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    Notifications
                  </span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto py-1 space-y-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab);
                        setIsNotifOpen(false);
                      }}
                      className={`p-2.5 rounded-lg text-left cursor-pointer transition-colors ${
                        n.read
                          ? "opacity-60 hover:opacity-100 hover:bg-[#141E30]"
                          : "bg-[#141F33] hover:bg-[#1A2842] border-l-2 border-cyan-400"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-200">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Equal Contributor Switcher */}
        <div className="relative" ref={memberMenuRef}>
          <button
            onClick={() => setIsMemberMenuOpen(!isMemberMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#131C2D] border border-transparent hover:border-[#1E2B42] transition-all"
          >
            <img
              src={currentMember.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={currentMember.name}
              className="w-7 h-7 rounded-md object-cover border border-[#263757]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-200 leading-tight">
                {currentMember.name.split(" ")[0]}
              </span>
              <span className="text-[9px] font-mono text-cyan-400 leading-none">
                {currentMember.callsign}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Switch Member Dropdown */}
          {isMemberMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0E1522] border border-[#1E2B42] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-[#1C273C] mb-1">
                <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                  Active Team Contributor (6 Equal)
                </p>
                <p className="text-[11px] text-slate-400">
                  Switch who is contributing right now:
                </p>
              </div>

              <div className="space-y-1">
                {members.map((m) => {
                  const isSelected = m.id === currentMember.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCurrentMemberId(m.id);
                        setIsMemberMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-semibold"
                          : "text-slate-300 hover:bg-[#141E30]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <div>
                          <div className="text-xs">{m.name}</div>
                          <div className="text-[9px] font-mono text-slate-400">
                            Callsign: {m.callsign}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-[#1C273C]">
                <button
                  onClick={() => {
                    setActiveTab("team");
                    setIsMemberMenuOpen(false);
                  }}
                  className="w-full text-center py-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  View & Edit Team Profiles →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
