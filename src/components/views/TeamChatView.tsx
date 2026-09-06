"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  User,
  Hash,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const TeamChatView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    addMessageReaction,
    members,
    currentMember,
    setIsByteBotOpen,
  } = useTeam();

  const [activeChannel, setActiveChannel] = useState<string>("general");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: "general", name: "#general-lab", desc: "Team sync & hardware logistics" },
    { id: "hardware", name: "#hardware-bringup", desc: "Soldering, PCB, and test bench" },
    { id: "firmware", name: "#firmware-esp32", desc: "C++, FreeRTOS, TinyML" },
    { id: "testing", name: "#flight-testing", desc: "Field trial coordination" },
  ];

  const filteredMessages = chatMessages.filter(
    (m) => m.channelId === activeChannel
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(activeChannel, inputText.trim());
    setInputText("");
  };

  const reactionEmojis = ["👍", "🔥", "🚀", "⚡", "👏", "👀"];

  return (
    <div className="space-y-4 animate-in fade-in h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1C273C] flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Team Chat
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
              6 Innovators Synced
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick lab communication: coordinate bench testing, parts arrivals, and field trials.
          </p>
        </div>

        <button
          onClick={() => setIsByteBotOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Channels List (3 Cols) */}
        <div className="md:col-span-3 bg-[#0A0E18] border border-[#1C273C] rounded-2xl p-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Lab Channels
            </div>
            {channels.map((ch) => {
              const isCurrent = activeChannel === ch.id;
              const count = chatMessages.filter((m) => m.channelId === ch.id).length;

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors text-left ${
                    isCurrent
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#121B2D]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{ch.name.replace("#", "")}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-[10px] text-slate-500">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Online Members Presence */}
          <div className="pt-3 border-t border-[#1C273C]">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
              Online at the Lab
            </div>
            <div className="space-y-1.5">
              {members.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    {m.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <span className="truncate text-[11px] font-mono">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Messages Stream & Composer (9 Cols) */}
        <div className="md:col-span-9 hardware-card rounded-2xl flex flex-col justify-between overflow-hidden border border-[#1C273C]">
          {/* Channel Header Banner */}
          <div className="px-4 py-2.5 bg-[#0A0E18] border-b border-[#1C273C] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-cyan-400">
                #{activeChannel}
              </span>
              <span className="text-xs text-slate-400">
                — {channels.find((c) => c.id === activeChannel)?.desc}
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-grid-circuit">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No messages yet in #{activeChannel}. Say hello to the team!
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const sender = members.find((m) => m.id === msg.senderId);
                const isMe = msg.senderId === currentMember.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 group ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <img
                      src={sender?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={sender?.name || "Member"}
                      className="w-7 h-7 rounded-md object-cover mt-0.5 flex-shrink-0"
                    />

                    <div className={`max-w-[80%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                      <div
                        className={`flex items-center gap-2 text-[11px] font-mono ${
                          isMe ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span className="font-bold text-slate-300">
                          {sender?.name || "Member"}
                        </span>
                        <span className="text-[10px] text-cyan-400">
                          {sender?.callsign}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          isMe
                            ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-100"
                            : "bg-[#0A0F1A] border border-[#1A263D] text-slate-200"
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* Reactions row */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-[#1C273C]/50">
                            {msg.reactions.map((r, i) => (
                              <button
                                key={i}
                                onClick={() => addMessageReaction(msg.id, r.emoji)}
                                className={`text-[11px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                  r.users.includes(currentMember.id)
                                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                                    : "bg-[#141F32] border-[#223554] text-slate-300"
                                }`}
                              >
                                <span>{r.emoji}</span>
                                <span className="font-mono text-[9px]">{r.users.length}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Emoji Reaction Trigger on Hover */}
                      <div
                        className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pt-0.5 ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {reactionEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addMessageReaction(msg.id, emoji)}
                            className="text-xs p-0.5 rounded hover:bg-[#141F32] transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#0A0E18] border-t border-[#1C273C] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Message #${activeChannel} as ${currentMember.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D1422] border border-[#1E2E4A] focus:border-cyan-400 text-white text-xs outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-bold text-xs font-mono transition-all flex items-center gap-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
