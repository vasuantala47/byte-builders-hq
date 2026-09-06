"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  DollarSign,
  Plus,
  Trash2,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const BudgetView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, members, currentMember } = useTeam();

  const [isAdding, setIsAdding] = useState(false);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Hardware Components");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  const totalBudget = 150.0;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const percentSpent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim() || !cost) return;

    addExpense({
      item: item.trim(),
      category,
      quantity: parseInt(quantity) || 1,
      cost: parseFloat(cost) || 0,
      date: new Date().toISOString().split("T")[0],
      notes: notes.trim(),
    });

    setIsAdding(false);
    setItem("");
    setCost("");
    setQuantity("1");
    setNotes("");
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Budget & Expenses
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono">
              ${totalSpent.toFixed(2)} Total Spent
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track hackathon hardware spending, receipt logs, and remaining team funds.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAdding ? "Cancel" : "Log Expense"}</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="hardware-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Total Budget Cap
            </span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {formatCurrency(totalBudget)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Hackathon hardware stipend
          </span>
        </div>

        {/* Total Spent */}
        <div className="hardware-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Total Spent
            </span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {formatCurrency(totalSpent)}
          </div>
          <div className="w-full bg-[#182438] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percentSpent > 90 ? "bg-red-500" : "bg-amber-400"
              }`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="hardware-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Remaining Funds
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatCurrency(remaining)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {100 - percentSpent}% available for emergency parts
          </span>
        </div>
      </div>

      {/* Log Expense Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-2xl bg-[#0D1524] border border-emerald-500/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 font-mono uppercase">
              Log Hardware Purchase
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Purchased by: {currentMember.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder="Item Name (e.g. 1S 800mAh LiPo Battery Pack)"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Total Cost ($)"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none"
            >
              <option value="Microcontrollers">Microcontrollers</option>
              <option value="Sensors">Sensors</option>
              <option value="Communication">Communication (LoRa/RF)</option>
              <option value="Power">Power & Battery</option>
              <option value="Materials">Materials & Filament</option>
              <option value="Components">Passive Components</option>
              <option value="Tools">Tools & Prototyping</option>
            </select>

            <input
              type="text"
              placeholder="Notes / Supplier order number"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-400 text-black font-bold text-xs font-mono"
            >
              Record Purchase
            </button>
          </div>
        </form>
      )}

      {/* Expense History Table */}
      <div className="hardware-card rounded-2xl overflow-hidden border border-[#1C273C]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0E18] text-slate-400 font-mono text-[10px] uppercase border-b border-[#1C273C]">
              <tr>
                <th className="p-3.5">Purchased Item</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Cost</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Purchaser</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182338]">
              {expenses.map((exp) => {
                const buyer = members.find((m) => m.id === exp.purchasedById);

                return (
                  <tr key={exp.id} className="hover:bg-[#111A2D] transition-colors">
                    <td className="p-3.5 font-bold text-white">{exp.item}</td>
                    <td className="p-3.5 font-mono text-cyan-400 text-[11px]">{exp.category}</td>
                    <td className="p-3.5 font-mono text-slate-300">{exp.quantity}</td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      {formatCurrency(exp.cost)}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{exp.date}</td>
                    <td className="p-3.5 text-slate-300">
                      {buyer ? buyer.name.split(" ")[0] : "Member"}
                    </td>
                    <td className="p-3.5 text-slate-400 truncate max-w-xs">{exp.notes || "—"}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
