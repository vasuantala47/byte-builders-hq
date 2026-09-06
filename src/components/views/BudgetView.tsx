"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { BudgetExpense } from "@/types";
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  TrendingDown,
  TrendingUp,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const BudgetView: React.FC = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudgetTotal,
    project,
    members,
    currentMember,
  } = useTeam();

  // Active modals
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<BudgetExpense | null>(null);
  const [isEditingBudgetCap, setIsEditingBudgetCap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Edit Budget Cap state
  const totalBudget = project.budgetTotal || 250.0;
  const [newBudgetCap, setNewBudgetCap] = useState(totalBudget.toString());

  // New Expense form state
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Hardware Components");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  // Edit Expense form state
  const [editItem, setEditItem] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const categories = [
    "Hardware Components",
    "Sensors & Modules",
    "Microcontrollers",
    "PCB Fabrication",
    "Fasteners & Enclosure",
    "Tools & Consumables",
    "Shipping & Sourcing",
    "Other",
  ];

  // Calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const percentSpent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const handleSaveBudgetCap = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newBudgetCap);
    if (!isNaN(parsed) && parsed > 0) {
      updateBudgetTotal(parsed);
      setIsEditingBudgetCap(false);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
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

    setIsAddingExpense(false);
    setItem("");
    setCost("");
    setQuantity("1");
    setNotes("");
  };

  const openEditExpense = (exp: BudgetExpense) => {
    setEditingExpense(exp);
    setEditItem(exp.item);
    setEditCategory(exp.category);
    setEditCost(exp.cost.toString());
    setEditQuantity(exp.quantity.toString());
    setEditNotes(exp.notes || "");
  };

  const handleSaveEditedExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !editItem.trim() || !editCost) return;

    updateExpense(editingExpense.id, {
      item: editItem.trim(),
      category: editCategory,
      quantity: parseInt(editQuantity) || 1,
      cost: parseFloat(editCost) || 0,
      notes: editNotes.trim(),
    });

    setEditingExpense(null);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCat = categoryFilter === "All" || exp.category === categoryFilter;
    const matchesSearch =
      exp.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Team Budget & Spending
            </h1>
            <span className="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {percentSpent}% Used
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Keep track of hardware components, PCB milling orders, and tools. Everyone has full visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setNewBudgetCap(totalBudget.toString());
              setIsEditingBudgetCap(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Budget Cap</span>
          </button>

          <button
            onClick={() => setIsAddingExpense(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget Cap */}
        <div className="hardware-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Allocated Budget</span>
            <button
              onClick={() => {
                setNewBudgetCap(totalBudget.toString());
                setIsEditingBudgetCap(true);
              }}
              className="p-1 rounded-md text-slate-500 hover:text-cyan-400 transition-colors"
              title="Edit total budget cap"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-3xl font-bold text-white mt-2 tracking-tight">
            {formatCurrency(totalBudget)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>Hackathon team stipend & funds</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="hardware-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Spent so Far</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-400 mt-2 tracking-tight">
            {formatCurrency(totalSpent)}
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentSpent > 85
                  ? "bg-rose-500"
                  : percentSpent > 50
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Remaining Funds */}
        <div className="hardware-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Remaining Team Balance</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2 tracking-tight">
            {formatCurrency(remaining)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            {remaining > 50 ? (
              <span className="text-emerald-400 font-medium">Safe buffer available</span>
            ) : remaining > 0 ? (
              <span className="text-amber-400 font-medium">Caution: Low reserve</span>
            ) : (
              <span className="text-rose-400 font-medium">Budget exceeded!</span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Budget Cap Modal */}
      {isEditingBudgetCap && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Adjust Total Budget Cap</h3>
              </div>
              <button
                onClick={() => setIsEditingBudgetCap(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudgetCap} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Total Budget Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={newBudgetCap}
                    onChange={(e) => setNewBudgetCap(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-base font-semibold outline-none focus:border-cyan-400"
                    placeholder="e.g. 500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Update your hackathon hardware budget limit anytime as grants or reimbursements are received.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBudgetCap(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Save Budget Cap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log New Expense Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Log Hardware Expense</h3>
              </div>
              <button
                onClick={() => setIsAddingExpense(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BME688 AI Gas Sensor Breakouts (2x)"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Cost ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="28.50"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Notes & Vendor
                </label>
                <input
                  type="text"
                  placeholder="DigiKey order #98231, overnight delivery included"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Edit Expense Details</h3>
              </div>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={editItem}
                  onChange={(e) => setEditItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Cost ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editCost}
                      onChange={(e) => setEditCost(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Notes
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${editingExpense.item}"?`)) {
                      deleteExpense(editingExpense.id);
                      setEditingExpense(null);
                    }
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Expense</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingExpense(null)}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["All", ...categories.slice(0, 4)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-slate-200 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* Expenses Table / Cards */}
      <div className="hardware-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Itemized Expenses Log</h3>
          <span className="text-xs text-slate-400 font-medium">
            {filteredExpenses.length} entries recorded
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No expenses found matching your filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredExpenses.map((exp) => {
              const purchaser = members.find((m) => m.id === exp.purchasedById);

              return (
                <div
                  key={exp.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0 mt-0.5">
                      ${Math.round(exp.cost)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{exp.item}</h4>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                          {exp.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>Qty: {exp.quantity}</span>
                        <span>•</span>
                        <span>{exp.date}</span>
                        <span>•</span>
                        <span>Logged by {purchaser?.name.split(" ")[0] || "Team Member"}</span>
                        {exp.notes && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 italic max-w-xs truncate">{exp.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-base font-bold text-white tracking-tight">
                        {formatCurrency(exp.cost)}
                      </div>
                      <span className="text-[10px] text-slate-500">Confirmed purchase</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditExpense(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete expense "${exp.item}"?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
