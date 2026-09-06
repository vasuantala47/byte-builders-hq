"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Cpu,
  HelpCircle,
} from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

export const ByteBotModal: React.FC = () => {
  const { isByteBotOpen, setIsByteBotOpen, currentMember } = useTeam();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Hello **${currentMember.name}**! I am **ByteBot**, the embedded hardware engineering copilot for **Byte Builders HQ**.

How can I assist your hardware prototyping today?
* Calculating battery life & LDO efficiency
* Debugging I2C, SPI, or UART bus issues
* ESP32-S3 firmware & FreeRTOS task optimization
* Selecting sensors, pinouts, and discrete components
* Reviewing circuit schematics or antenna impedance matching`,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isByteBotOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isByteBotOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isByteBotOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const newHistory: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "No response received.";
      setMessages([...newHistory, { role: "model", content: reply }]);
    } catch (err: any) {
      console.error("ByteBot chat error:", err);
      setMessages([
        ...newHistory,
        {
          role: "model",
          content: `⚠️ Error contacting Gemini AI: ${err.message || "Network error"}. Please check your connection or GEMINI_API_KEY.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickPrompts = [
    "How to debug I2C bus lockups with pull-up resistors?",
    "Calculate runtime for 800mAh battery at 45mA active / 16uA sleep",
    "ESP32-S3 Deep Sleep wake stub setup in C++",
    "BME688 AI gas sensor hotplate temperature curve",
    "50-ohm RF trace design for 915MHz LoRa antenna",
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#0B101C] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1C273C] flex items-center justify-between bg-[#080D17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono tracking-wide">
                  ByteBot • Hardware Engineering Copilot
                </h2>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-mono font-semibold">
                  Gemini AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Embedded Systems • Circuit Schematics • Sensor Interfacing • TinyML
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setMessages([
                  {
                    role: "model",
                    content: `Chat cleared. Ready for your next hardware engineering question!`,
                  },
                ])
              }
              title="Reset conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131C2D]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsByteBotOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131C2D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-b border-[#172236] bg-[#090E1A] flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#111A2C] hover:bg-cyan-950/50 border border-[#1E2E4A] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors flex items-center gap-1 font-mono"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-grid-circuit">
          {messages.map((m, idx) => {
            const isModel = m.role === "model";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isModel ? "justify-start" : "justify-end"}`}
              >
                {isModel && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    isModel
                      ? "bg-[#0E1626] border border-[#1E2D47] text-slate-200 shadow-lg"
                      : "bg-cyan-950/60 border border-cyan-500/50 text-cyan-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{m.content}</div>

                  {isModel && (
                    <div className="mt-2 pt-2 border-t border-[#1C2A42] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>ByteBot Engine</span>
                      <button
                        onClick={() => handleCopy(m.content, idx)}
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isModel && (
                  <div className="w-7 h-7 rounded-lg bg-[#141F33] border border-[#233555] flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-cyan-400 text-xs font-mono">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5 bg-[#0E1626] border border-[#1E2D47] px-3 py-2 rounded-xl">
                <span>ByteBot analyzing hardware schematics & code</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1C273C] bg-[#080D17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about hardware, circuits, firmware, components..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D1422] border border-[#1E2E4A] focus:border-cyan-400 text-white text-xs outline-none placeholder:text-slate-500 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
            <span>Ask questions on pinouts, power calculations, code, or debugging.</span>
            <span className="text-cyan-400/80">6-Member Lab Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};
