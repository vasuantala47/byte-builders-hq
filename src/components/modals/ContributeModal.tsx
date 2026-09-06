"use client";

import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import {
  X,
  Lightbulb,
  BookOpen,
  MessageSquareShare,
  FlaskConical,
  CheckSquare,
  Cpu,
  Trophy,
  GitBranch,
} from "lucide-react";
import { ComponentCategory } from "@/types";

type ContributeType =
  | "idea"
  | "research"
  | "suggestion"
  | "experiment"
  | "task"
  | "component"
  | "achievement"
  | "stage";

export const ContributeModal: React.FC = () => {
  const {
    isContributeOpen,
    setIsContributeOpen,
    submitIdea,
    submitResearch,
    submitSuggestion,
    addExperiment,
    createTask,
    addComponent,
    addAchievement,
    setActiveTab,
  } = useTeam();

  const [activeType, setActiveType] = useState<ContributeType>("idea");

  // Idea Form State
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaProblem, setIdeaProblem] = useState("");
  const [ideaSolution, setIdeaSolution] = useState("");
  const [ideaExplanation, setIdeaExplanation] = useState("");
  const [ideaHardware, setIdeaHardware] = useState("");
  const [ideaSoftware, setIdeaSoftware] = useState("");
  const [ideaCost, setIdeaCost] = useState("");
  const [ideaAdvantages, setIdeaAdvantages] = useState("");
  const [ideaRisks, setIdeaRisks] = useState("");

  // Research Form State
  const [resTitle, setResTitle] = useState("");
  const [resTopic, setResTopic] = useState("Hardware");
  const [resSummary, setResSummary] = useState("");
  const [resFindings, setResFindings] = useState("");
  const [resLearned, setResLearned] = useState("");
  const [resHelps, setResHelps] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resTags, setResTags] = useState("Electronics, Sensors, Microcontrollers");

  // Suggestion State
  const [sugTitle, setSugTitle] = useState("");
  const [sugContent, setSugContent] = useState("");

  // Experiment State
  const [expNumber, setExpNumber] = useState("EXP-04");
  const [expTitle, setExpTitle] = useState("");
  const [expObjective, setExpObjective] = useState("");
  const [expHypothesis, setExpHypothesis] = useState("");
  const [expSetup, setExpSetup] = useState("");
  const [expComponents, setExpComponents] = useState("");
  const [expExpected, setExpExpected] = useState("");

  // Task State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [taskStatus, setTaskStatus] = useState<"BACKLOG" | "TODO" | "IN PROGRESS">("TODO");

  // Component State
  const [compName, setCompName] = useState("");
  const [compCategory, setCompCategory] = useState<ComponentCategory>("Sensor");
  const [compReq, setCompReq] = useState("1");
  const [compAvail, setCompAvail] = useState("0");
  const [compPrice, setCompPrice] = useState("0.00");
  const [compSupplier, setCompSupplier] = useState("Mouser / DigiKey");
  const [compLocation, setCompLocation] = useState("Bin A-01");

  // Achievement State
  const [achTitle, setAchTitle] = useState("");
  const [achDesc, setAchDesc] = useState("");

  if (!isContributeOpen) return null;

  const handleClose = () => {
    setIsContributeOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === "idea") {
      if (!ideaTitle.trim() || !ideaProblem.trim()) return;
      submitIdea({
        title: ideaTitle,
        problem: ideaProblem,
        proposedSolution: ideaSolution || ideaProblem,
        explanation: ideaExplanation,
        howItWorks: ideaExplanation,
        requiredHardware: ideaHardware,
        requiredSoftware: ideaSoftware,
        estimatedCost: parseFloat(ideaCost) || 0,
        advantages: ideaAdvantages,
        risks: ideaRisks,
        questions: "",
        references: "",
        status: "New",
      });
      setActiveTab("ideas");
    } else if (activeType === "research") {
      if (!resTitle.trim() || !resSummary.trim()) return;
      submitResearch({
        title: resTitle,
        topic: resTopic,
        summary: resSummary,
        keyFindings: resFindings,
        whatWeLearned: resLearned,
        howItHelps: resHelps,
        sourceUrl: resUrl,
        tags: resTags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setActiveTab("research");
    } else if (activeType === "suggestion") {
      if (!sugTitle.trim() || !sugContent.trim()) return;
      submitSuggestion(sugTitle, sugContent);
      setActiveTab("suggestions");
    } else if (activeType === "experiment") {
      if (!expTitle.trim() || !expObjective.trim()) return;
      addExperiment({
        experimentNumber: expNumber,
        title: expTitle,
        objective: expObjective,
        hypothesis: expHypothesis,
        setup: expSetup,
        componentsUsed: expComponents.split(",").map((c) => c.trim()).filter(Boolean),
        expectedResult: expExpected,
        actualResult: "Pending execution.",
        measurements: "TBD",
        problems: "None logged yet.",
        conclusion: "Running test protocol.",
        status: "Planned",
        mediaUrls: [],
      });
      setActiveTab("experiments");
    } else if (activeType === "task") {
      if (!taskTitle.trim()) return;
      createTask({
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        status: taskStatus,
        checklist: [],
      });
      setActiveTab("tasks");
    } else if (activeType === "component") {
      if (!compName.trim()) return;
      addComponent({
        name: compName,
        category: compCategory,
        quantityRequired: parseInt(compReq) || 1,
        quantityAvailable: parseInt(compAvail) || 0,
        status: parseInt(compAvail) >= parseInt(compReq) ? "Available" : "Needed",
        estimatedPrice: parseFloat(compPrice) || 0,
        actualPrice: parseFloat(compPrice) || 0,
        supplier: compSupplier,
        link: "",
        storageLocation: compLocation,
      });
      setActiveTab("components");
    } else if (activeType === "achievement") {
      if (!achTitle.trim()) return;
      addAchievement(achTitle, achDesc, "Trophy");
      setActiveTab("achievements");
    }

    handleClose();
  };

  const contributeOptions = [
    { id: "idea", label: "Submit Idea", icon: Lightbulb },
    { id: "research", label: "Submit Research", icon: BookOpen },
    { id: "suggestion", label: "Make Suggestion", icon: MessageSquareShare },
    { id: "experiment", label: "Add Experiment", icon: FlaskConical },
    { id: "task", label: "Add Task", icon: CheckSquare },
    { id: "component", label: "Add Component", icon: Cpu },
    { id: "achievement", label: "Add Achievement", icon: Trophy },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0E1524] border border-[#1E2C44] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1C273C] flex items-center justify-between bg-[#0A0E18]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Contribute to Byte Builders HQ
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141E30]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Horizontal Bar */}
        <div className="px-4 pt-3 pb-2 border-b border-[#1C273C] flex gap-1.5 overflow-x-auto bg-[#0C121F]">
          {contributeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveType(opt.id as ContributeType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#152033]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* IDEA FORM */}
          {activeType === "idea" && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dual-Chamber Modular Gas Sensor Pod with Venturi Airflow"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Problem It Solves *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What bottleneck or limitation does this solve?"
                    value={ideaProblem}
                    onChange={(e) => setIdeaProblem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Proposed Solution
                  </label>
                  <textarea
                    rows={3}
                    placeholder="How do we solve it with hardware/firmware?"
                    value={ideaSolution}
                    onChange={(e) => setIdeaSolution(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Required Hardware
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BME688, PETG, Nylon filter"
                    value={ideaHardware}
                    onChange={(e) => setIdeaHardware(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Required Software
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FreeRTOS, TinyML"
                    value={ideaSoftware}
                    onChange={(e) => setIdeaSoftware(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="25.00"
                    value={ideaCost}
                    onChange={(e) => setIdeaCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Key Advantages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zero power consumption, response < 4s"
                    value={ideaAdvantages}
                    onChange={(e) => setIdeaAdvantages(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Technical Risks
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Moisture clogging, airspeed dependency"
                    value={ideaRisks}
                    onChange={(e) => setIdeaRisks(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* RESEARCH FORM */}
          {activeType === "research" && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Research Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESP32-S3 Deep Sleep Current Profiling & Power Domain Optimization"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Topic / Category
                  </label>
                  <select
                    value={resTopic}
                    onChange={(e) => setResTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Microcontrollers">Microcontrollers</option>
                    <option value="Power & Battery">Power & Battery</option>
                    <option value="Mechanical & CAD">Mechanical & CAD</option>
                    <option value="IoT & RF">IoT & RF</option>
                    <option value="Edge AI">Edge AI</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Source / Reference URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Executive Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief summary of what was investigated..."
                  value={resSummary}
                  onChange={(e) => setResSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Key Technical Findings
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What specific data or test findings were discovered?"
                    value={resFindings}
                    onChange={(e) => setResFindings(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    How it Helps Byte Builders
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Direct application to our current project..."
                    value={resHelps}
                    onChange={(e) => setResHelps(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* SUGGESTION FORM */}
          {activeType === "suggestion" && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Suggestion Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add a magnetic reed switch for tool-free activation"
                  value={sugTitle}
                  onChange={(e) => setSugTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Suggestion Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your quick idea or component tweak. Doesn't have to be a full project plan!"
                  value={sugContent}
                  onChange={(e) => setSugContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>
            </>
          )}

          {/* EXPERIMENT FORM */}
          {activeType === "experiment" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Exp #
                  </label>
                  <input
                    type="text"
                    value={expNumber}
                    onChange={(e) => setExpNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none font-mono"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Experiment Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BME688 AI Gas Sensor Hotplate Pulse Under 90% Humidity"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="What are you testing?"
                  value={expObjective}
                  onChange={(e) => setExpObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Scientific Hypothesis
                </label>
                <textarea
                  rows={2}
                  placeholder="If we test X, then Y will occur because..."
                  value={expHypothesis}
                  onChange={(e) => setExpHypothesis(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Benchtop Setup
                  </label>
                  <input
                    type="text"
                    placeholder="Instruments and test environment"
                    value={expSetup}
                    onChange={(e) => setExpSetup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Components Tested (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="ESP32-S3, BME688, TPS7A02"
                    value={expComponents}
                    onChange={(e) => setExpComponents(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* TASK FORM */}
          {activeType === "task" && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 50-ohm RF trace on Prototype V2 PCB"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details, pinouts, constraints..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="BACKLOG">BACKLOG</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* COMPONENT FORM */}
          {activeType === "component" && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Component Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semtech SX1262 LoRa Transceiver Module"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={compCategory}
                    onChange={(e) => setCompCategory(e.target.value as ComponentCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  >
                    <option value="Microcontroller">Microcontroller</option>
                    <option value="Sensor">Sensor</option>
                    <option value="Actuator">Actuator</option>
                    <option value="Power">Power & Battery</option>
                    <option value="Passive">Passive (R/L/C)</option>
                    <option value="Mechanical">Mechanical & Enclosure</option>
                    <option value="PCB">PCB / Board</option>
                    <option value="Communication">Communication</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Quantity Required
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={compReq}
                    onChange={(e) => setCompReq(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={compAvail}
                    onChange={(e) => setCompAvail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={compPrice}
                    onChange={(e) => setCompPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={compSupplier}
                    onChange={(e) => setCompSupplier(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    value={compLocation}
                    onChange={(e) => setCompLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* ACHIEVEMENT FORM */}
          {activeType === "achievement" && (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Milestone / Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First RF Telemetry Packet Received over 2km"
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What did the team accomplish?"
                  value={achDesc}
                  onChange={(e) => setAchDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>
            </>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#1C273C] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-[#141E30]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
              Post to Byte Builders HQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
