"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { ComponentCategory, ComponentStatus } from "@/types";
import {
  Cpu,
  Plus,
  AlertTriangle,
  ExternalLink,
  Search,
  Package,
  CheckCircle2,
  Trash2,
  Edit3,
  Check,
  Save,
  DollarSign,
  MapPin,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const HardwareLabView: React.FC = () => {
  const {
    components,
    members,
    currentMember,
    addComponent,
    updateComponent,
    deleteComponent,
    setIsContributeOpen,
    setIsByteBotOpen,
  } = useTeam();

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCompId, setEditingCompId] = useState<string | null>(null);

  const categories: (ComponentCategory | "All")[] = [
    "All",
    "Microcontroller",
    "Sensor",
    "Communication",
    "Power",
    "Passive",
    "Mechanical",
    "PCB",
    "Actuator",
  ];

  const statuses: ComponentStatus[] = [
    "Needed",
    "Searching",
    "Ordered",
    "Received",
    "Testing",
    "Available",
    "Installed",
  ];

  const filteredComponents = components.filter((c) => {
    const matchesCat = categoryFilter === "All" || c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const missingComponents = components.filter(
    (c) => c.quantityRequired > c.quantityAvailable
  );

  const totalBOMCost = components.reduce(
    (acc, curr) => acc + (curr.actualPrice || curr.estimatedPrice) * curr.quantityRequired,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Hardware Lab & Component Inventory
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
              {components.length} Line Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Physical stock management, bin locations, supplier orders, and low-stock alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContributeOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Component</span>
          </button>
        </div>
      </div>

      {/* Metrics Row & Critical Stock Warning */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total BOM Value */}
        <div className="hardware-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Total Hardware BOM Value
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {formatCurrency(totalBOMCost)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Across {components.reduce((acc, c) => acc + c.quantityRequired, 0)} total required parts
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Stock Shortage Warning */}
        <div className={`hardware-card rounded-xl p-4 flex items-center justify-between ${
          missingComponents.length > 0 ? "border-amber-500/50 bg-amber-950/10" : ""
        }`}>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
              Shortage Warning (Req &gt; Avail)
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {missingComponents.length} Parts Deficit
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {missingComponents.length > 0
                ? "Immediate action required before bench assembly"
                : "All required parts on hand"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* AI Hardware Advisor Card */}
        <div className="hardware-card rounded-xl p-4 flex items-center justify-between bg-gradient-to-r from-cyan-950/30 to-blue-950/20">
          <div>
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
              AI Component Substitution
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Ask ByteBot for pin-compatible alternatives or cheaper ICs.
            </p>
            <button
              onClick={() => setIsByteBotOpen(true)}
              className="text-[11px] text-cyan-400 hover:underline font-mono mt-1 block"
            >
              Consult AI Advisor →
            </button>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-cyan-400 text-black font-bold"
                  : "bg-[#0C121F] border border-[#1C273C] text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parts, supplier, bin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* Component Inventory Table */}
      <div className="hardware-card rounded-2xl overflow-hidden border border-[#1C273C]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0E18] text-slate-400 font-mono text-[10px] uppercase border-b border-[#1C273C]">
              <tr>
                <th className="p-3.5">Component / Specification</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Available / Required</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Unit Cost</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Supplier</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182338]">
              {filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                    No components found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredComponents.map((comp) => {
                  const isShortage = comp.quantityRequired > comp.quantityAvailable;
                  const purchaser = members.find((m) => m.id === comp.purchasedById);

                  return (
                    <tr
                      key={comp.id}
                      className={`hover:bg-[#111A2D] transition-colors ${
                        isShortage ? "bg-amber-950/10" : ""
                      }`}
                    >
                      {/* Name & Notes */}
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-white leading-snug">{comp.name}</div>
                        {comp.notes && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            {comp.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-3.5 font-mono text-cyan-400 text-[11px]">
                        {comp.category}
                      </td>

                      {/* Quantities (Stock Check) */}
                      <td className="p-3.5 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            isShortage
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {comp.quantityAvailable} / {comp.quantityRequired}
                        </span>
                        {isShortage && (
                          <div className="text-[9px] text-red-400 font-bold uppercase mt-0.5">
                            Shortage!
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={comp.status}
                          onChange={(e) =>
                            updateComponent(comp.id, {
                              status: e.target.value as ComponentStatus,
                            })
                          }
                          className="text-[10px] font-mono px-2 py-1 rounded bg-[#080D18] border border-[#1E2B42] text-slate-200 outline-none"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Cost */}
                      <td className="p-3.5 font-mono text-slate-300">
                        {formatCurrency(comp.actualPrice || comp.estimatedPrice)}
                      </td>

                      {/* Location */}
                      <td className="p-3.5 text-slate-400 font-mono text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{comp.storageLocation}</span>
                      </td>

                      {/* Supplier */}
                      <td className="p-3.5 text-slate-400 truncate max-w-[120px]">
                        {comp.link ? (
                          <a
                            href={comp.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>{comp.supplier}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          comp.supplier
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              updateComponent(comp.id, {
                                quantityAvailable: comp.quantityAvailable + 1,
                              })
                            }
                            title="Add 1 to available stock"
                            className="text-[10px] px-2 py-0.5 rounded bg-[#131E30] hover:bg-[#1B2942] text-cyan-400 font-mono"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => deleteComponent(comp.id)}
                            title="Remove component"
                            className="p-1 rounded text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
