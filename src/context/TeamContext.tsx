"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  TabType,
  TeamMember,
  Idea,
  IdeaStatus,
  ResearchItem,
  Suggestion,
  SuggestionStatus,
  Project,
  RoadmapStage,
  Task,
  TaskStatus,
  ComponentItem,
  Experiment,
  ExperimentStatus,
  PrototypeVersion,
  PrototypeStatus,
  DecisionRecord,
  WikiArticle,
  ChatMessage,
  ActivityLog,
  BudgetExpense,
  TeamAchievement,
  ProjectFile,
  TeamNotification,
  UniversalSearchResult,
} from "@/types";
import {
  loadWorkspaceData,
  saveWorkspaceData,
  getDefaultWorkspaceData,
  exportTeamDataToJson,
  importTeamDataFromJson,
  TeamWorkspaceData,
} from "@/lib/storage";
import { generateId } from "@/lib/utils";

interface TeamContextType {
  // Navigation & Authentication
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAuthenticated: boolean;
  loginWithCode: (code: string) => boolean;
  logout: () => void;
  teamCode: string;

  // Active Member (Any of 6 equal members)
  currentMember: TeamMember;
  setCurrentMemberId: (id: string) => void;
  updateMemberProfile: (id: string, updates: Partial<TeamMember>) => void;

  // Workspace Data State
  project: Project;
  members: TeamMember[];
  ideas: Idea[];
  research: ResearchItem[];
  suggestions: Suggestion[];
  stages: RoadmapStage[];
  tasks: Task[];
  components: ComponentItem[];
  experiments: Experiment[];
  prototypes: PrototypeVersion[];
  decisions: DecisionRecord[];
  wiki: WikiArticle[];
  chatMessages: ChatMessage[];
  activityLogs: ActivityLog[];
  expenses: BudgetExpense[];
  achievements: TeamAchievement[];
  files: ProjectFile[];
  notifications: TeamNotification[];
  isDemoData: boolean;

  // Actions
  submitIdea: (ideaData: Omit<Idea, "id" | "authorId" | "createdAt" | "upvotes" | "comments">) => Idea;
  updateIdeaStatus: (id: string, status: IdeaStatus) => void;
  upvoteIdea: (id: string) => void;
  addIdeaComment: (ideaId: string, content: string) => void;
  convertIdeaToProject: (ideaId: string) => void;
  convertIdeaToTask: (ideaId: string) => void;

  submitResearch: (data: Omit<ResearchItem, "id" | "authorId" | "createdAt" | "comments">) => ResearchItem;
  addResearchComment: (researchId: string, content: string) => void;

  submitSuggestion: (title: string, content: string) => Suggestion;
  supportSuggestion: (id: string) => void;
  updateSuggestionStatus: (id: string, status: SuggestionStatus) => void;
  convertSuggestionToIdea: (suggestionId: string) => void;
  convertSuggestionToTask: (suggestionId: string) => void;

  createTask: (data: Omit<Task, "id" | "createdAt" | "comments">) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskChecklist: (taskId: string, checklistId: string) => void;

  updateProject: (updates: Partial<Project>) => void;
  updateStageStatus: (stageId: string, status: "Pending" | "In Progress" | "Completed") => void;
  toggleStageChecklist: (stageId: string, checklistId: string) => void;
  addStage: (stageData: Omit<RoadmapStage, "id">) => RoadmapStage;
  updateStage: (stageId: string, updates: Partial<RoadmapStage>) => void;
  deleteStage: (stageId: string) => void;
  addStageChecklistItem: (stageId: string, text: string) => void;
  deleteStageChecklistItem: (stageId: string, checklistId: string) => void;

  addComponent: (data: Omit<ComponentItem, "id" | "createdAt">) => ComponentItem;
  updateComponent: (id: string, updates: Partial<ComponentItem>) => void;
  deleteComponent: (id: string) => void;

  addExperiment: (data: Omit<Experiment, "id" | "createdAt" | "contributorId">) => Experiment;
  updateExperimentStatus: (id: string, status: ExperimentStatus) => void;

  addPrototypeVersion: (data: Omit<PrototypeVersion, "id">) => PrototypeVersion;
  updatePrototypeStatus: (id: string, status: PrototypeStatus) => void;

  recordDecision: (data: Omit<DecisionRecord, "id" | "date" | "comments">) => DecisionRecord;

  addWikiArticle: (data: Omit<WikiArticle, "id" | "updatedAt" | "authorId">) => WikiArticle;
  updateWikiArticle: (id: string, content: string) => void;

  sendChatMessage: (channelId: string, content: string, attachments?: string[]) => void;
  addMessageReaction: (messageId: string, emoji: string) => void;

  updateBudgetTotal: (total: number) => void;
  addExpense: (data: Omit<BudgetExpense, "id" | "purchasedById">) => BudgetExpense;
  updateExpense: (id: string, updates: Partial<BudgetExpense>) => void;
  deleteExpense: (id: string) => void;

  addAchievement: (title: string, description: string, icon?: string) => void;
  uploadProjectFile: (name: string, category: ProjectFile["category"], size: string, url: string) => void;

  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Workspace Maintenance
  resetToDemoData: () => void;
  clearToCleanState: () => void;
  exportWorkspaceJson: () => string;
  importWorkspaceJson: (json: string) => boolean;

  // Modals & Assistant
  isContributeOpen: boolean;
  setIsContributeOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isByteBotOpen: boolean;
  setIsByteBotOpen: (open: boolean) => void;
  isShareOpen: boolean;
  setIsShareOpen: (open: boolean) => void;
  searchAllEntities: (query: string) => UniversalSearchResult[];
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<TeamWorkspaceData>(() => getDefaultWorkspaceData(true));
  const [currentMemberId, setCurrentMemberId] = useState<string>("member-1");
  const [activeTab, setActiveTab] = useState<TabType>("command-center");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default true for seamless lab access, customizable
  const [teamCode, setTeamCode] = useState<string>("BYTE-BUILDERS-2025");

  // Modals
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isByteBotOpen, setIsByteBotOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Initialize data on client mount and check URL query parameters for link-based auto-login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get("code") || params.get("join");
      const memberParam = params.get("member");

      if (codeParam) {
        const valid =
          codeParam.trim().toUpperCase() === "BYTE-BUILDERS-2025" ||
          codeParam.trim().toUpperCase() === "BYTE2025";
        if (valid) {
          setIsAuthenticated(true);
          localStorage.setItem("byte_builders_auth", "authenticated");
        }
      }

      if (memberParam) {
        const cleanId = memberParam.startsWith("member-") ? memberParam : `member-${memberParam}`;
        setCurrentMemberId(cleanId);
      }
    }

    // Initial load from central server first, fallback to localStorage
    fetch("/api/sync")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
          saveWorkspaceData(json.data);
        } else {
          setData(loadWorkspaceData());
        }
      })
      .catch(() => {
        setData(loadWorkspaceData());
      });

    // Check stored auth state
    const savedAuth = localStorage.getItem("byte_builders_auth");
    if (savedAuth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  // Background polling for real-time multi-device sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;

      fetch("/api/sync")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setData((prev) => {
              if (!prev) return json.data;
              if (json.data.lastUpdated && json.data.lastUpdated !== prev.lastUpdated) {
                saveWorkspaceData(json.data);
                return json.data;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Sync back to storage and central server on update
  const persist = useCallback((newData: TeamWorkspaceData) => {
    setData(newData);
    saveWorkspaceData(newData);

    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: newData }),
    }).catch((err) => console.warn("Background server sync error:", err));
  }, []);

  // Helper to log activities
  const logActivity = useCallback(
    (
      type: ActivityLog["type"],
      description: string,
      memberId: string,
      linkTab?: TabType,
      linkId?: string
    ) => {
      setData((prev) => {
        if (!prev) return prev;
        const newLog: ActivityLog = {
          id: generateId("act"),
          type,
          description,
          memberId,
          timestamp: new Date().toISOString(),
          linkTab,
          linkId,
        };
        const updated = {
          ...prev,
          activityLogs: [newLog, ...prev.activityLogs.slice(0, 99)],
        };
        saveWorkspaceData(updated);
        return updated;
      });
    },
    []
  );

  // Authentication
  const loginWithCode = (code: string): boolean => {
    const valid =
      code.trim().toUpperCase() === teamCode.toUpperCase() ||
      code.trim().toUpperCase() === "BYTE-BUILDERS-2025" ||
      code.trim().toUpperCase() === "BYTE2025";
    if (valid) {
      setIsAuthenticated(true);
      localStorage.setItem("byte_builders_auth", "authenticated");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("byte_builders_auth");
  };

  // Active Member
  const members = data?.members || [];
  const currentMember =
    members.find((m) => m.id === currentMemberId) ||
    members[0] || {
      id: "member-1",
      name: "Alex Rivera",
      callsign: "Spark",
      avatar: "",
      bio: "Hardware prototyping",
      skills: ["Embedded C++"],
      online: true,
      joinedAt: "2025-02-01",
      contributionsCount: 1,
    };

  const updateMemberProfile = (id: string, updates: Partial<TeamMember>) => {
    if (!data) return;
    const updatedMembers = data.members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    persist({ ...data, members: updatedMembers });
    logActivity("system", `${currentMember.name} updated profile details`, id, "team");
  };

  // Ideas
  const submitIdea = (ideaData: Omit<Idea, "id" | "authorId" | "createdAt" | "upvotes" | "comments">) => {
    if (!data) throw new Error("Workspace not ready");
    const newIdea: Idea = {
      ...ideaData,
      id: generateId("idea"),
      authorId: currentMember.id,
      createdAt: new Date().toISOString(),
      upvotes: [currentMember.id],
      comments: [],
    };
    persist({
      ...data,
      ideas: [newIdea, ...data.ideas],
    });
    logActivity("idea", `${currentMember.name} proposed new idea: "${newIdea.title}"`, currentMember.id, "ideas", newIdea.id);
    return newIdea;
  };

  const updateIdeaStatus = (id: string, status: IdeaStatus) => {
    if (!data) return;
    const idea = data.ideas.find((i) => i.id === id);
    const updated = data.ideas.map((i) => (i.id === id ? { ...i, status } : i));
    persist({ ...data, ideas: updated });
    if (idea) {
      logActivity("idea", `${currentMember.name} changed idea status to ${status}: "${idea.title}"`, currentMember.id, "ideas", id);
    }
  };

  const upvoteIdea = (id: string) => {
    if (!data) return;
    const updated = data.ideas.map((i) => {
      if (i.id !== id) return i;
      const hasVoted = i.upvotes.includes(currentMember.id);
      return {
        ...i,
        upvotes: hasVoted ? i.upvotes.filter((uid) => uid !== currentMember.id) : [...i.upvotes, currentMember.id],
      };
    });
    persist({ ...data, ideas: updated });
  };

  const addIdeaComment = (ideaId: string, content: string) => {
    if (!data || !content.trim()) return;
    const comment = {
      id: generateId("c-idea"),
      authorId: currentMember.id,
      authorName: currentMember.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = data.ideas.map((i) =>
      i.id === ideaId ? { ...i, comments: [...i.comments, comment] } : i
    );
    persist({ ...data, ideas: updated });
  };

  const convertIdeaToProject = (ideaId: string) => {
    if (!data) return;
    const idea = data.ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const updatedProject: Project = {
      ...data.project,
      title: idea.title,
      objective: idea.proposedSolution,
      problem: idea.problem,
      solution: idea.explanation,
      status: "Active",
    };
    const updatedIdeas = data.ideas.map((i) =>
      i.id === ideaId ? { ...i, status: "Selected" as IdeaStatus, linkedProjectId: data.project.id } : i
    );
    persist({ ...data, project: updatedProject, ideas: updatedIdeas });
    logActivity("idea", `Idea "${idea.title}" was selected as primary Project!`, currentMember.id, "projects");
  };

  const convertIdeaToTask = (ideaId: string) => {
    if (!data) return;
    const idea = data.ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const newTask: Task = {
      id: generateId("task"),
      title: `Build & Validate: ${idea.title}`,
      description: idea.explanation || idea.proposedSolution,
      priority: "High",
      status: "TODO",
      assigneeId: currentMember.id,
      checklist: [
        { id: generateId("chk"), text: "Review hardware requirements", done: false },
        { id: generateId("chk"), text: "Assemble bench prototype", done: false },
        { id: generateId("chk"), text: "Perform test experiment", done: false },
      ],
      relatedIdeaId: ideaId,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    persist({ ...data, tasks: [newTask, ...data.tasks] });
    logActivity("task", `Created Task from Idea: "${newTask.title}"`, currentMember.id, "tasks", newTask.id);
  };

  // Research
  const submitResearch = (dataInput: Omit<ResearchItem, "id" | "authorId" | "createdAt" | "comments">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: ResearchItem = {
      ...dataInput,
      id: generateId("res"),
      authorId: currentMember.id,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    persist({ ...data, research: [item, ...data.research] });
    logActivity("research", `${currentMember.name} submitted research: "${item.title}"`, currentMember.id, "research", item.id);
    return item;
  };

  const addResearchComment = (researchId: string, content: string) => {
    if (!data || !content.trim()) return;
    const comment = {
      id: generateId("c-res"),
      authorId: currentMember.id,
      authorName: currentMember.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = data.research.map((r) =>
      r.id === researchId ? { ...r, comments: [...r.comments, comment] } : r
    );
    persist({ ...data, research: updated });
  };

  // Suggestions
  const submitSuggestion = (title: string, content: string) => {
    if (!data) throw new Error("Workspace not ready");
    const item: Suggestion = {
      id: generateId("sug"),
      title,
      content,
      authorId: currentMember.id,
      createdAt: new Date().toISOString(),
      status: "Open",
      supports: [currentMember.id],
      comments: [],
    };
    persist({ ...data, suggestions: [item, ...data.suggestions] });
    logActivity("suggestion", `${currentMember.name} posted a suggestion: "${title}"`, currentMember.id, "suggestions", item.id);
    return item;
  };

  const supportSuggestion = (id: string) => {
    if (!data) return;
    const updated = data.suggestions.map((s) => {
      if (s.id !== id) return s;
      const hasSupported = s.supports.includes(currentMember.id);
      return {
        ...s,
        supports: hasSupported ? s.supports.filter((uid) => uid !== currentMember.id) : [...s.supports, currentMember.id],
      };
    });
    persist({ ...data, suggestions: updated });
  };

  const updateSuggestionStatus = (id: string, status: SuggestionStatus) => {
    if (!data) return;
    const updated = data.suggestions.map((s) => (s.id === id ? { ...s, status } : s));
    persist({ ...data, suggestions: updated });
  };

  const convertSuggestionToIdea = (suggestionId: string) => {
    if (!data) return;
    const sug = data.suggestions.find((s) => s.id === suggestionId);
    if (!sug) return;
    const newIdea: Idea = {
      id: generateId("idea"),
      title: sug.title,
      problem: "Derived from open suggestion",
      proposedSolution: sug.content,
      explanation: sug.content,
      howItWorks: "",
      requiredHardware: "To be decided",
      requiredSoftware: "",
      estimatedCost: 0,
      advantages: "Team suggested improvement",
      risks: "Under technical review",
      questions: "",
      references: "",
      authorId: currentMember.id,
      createdAt: new Date().toISOString(),
      status: "New",
      upvotes: [currentMember.id],
      comments: [],
    };
    const updatedSug = data.suggestions.map((s) =>
      s.id === suggestionId ? { ...s, status: "Accepted" as SuggestionStatus } : s
    );
    persist({ ...data, ideas: [newIdea, ...data.ideas], suggestions: updatedSug });
    logActivity("idea", `Suggestion promoted to Idea Vault: "${sug.title}"`, currentMember.id, "ideas", newIdea.id);
  };

  const convertSuggestionToTask = (suggestionId: string) => {
    if (!data) return;
    const sug = data.suggestions.find((s) => s.id === suggestionId);
    if (!sug) return;
    const newTask: Task = {
      id: generateId("task"),
      title: `Implement Suggestion: ${sug.title}`,
      description: sug.content,
      priority: "Medium",
      status: "TODO",
      assigneeId: currentMember.id,
      checklist: [{ id: generateId("chk"), text: "Investigate proposal", done: false }],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    const updatedSug = data.suggestions.map((s) =>
      s.id === suggestionId ? { ...s, status: "Accepted" as SuggestionStatus } : s
    );
    persist({ ...data, tasks: [newTask, ...data.tasks], suggestions: updatedSug });
    logActivity("task", `Created task from suggestion: "${newTask.title}"`, currentMember.id, "tasks", newTask.id);
  };

  // Tasks (Kanban)
  const createTask = (taskData: Omit<Task, "id" | "createdAt" | "comments">) => {
    if (!data) throw new Error("Workspace not ready");
    const newTask: Task = {
      ...taskData,
      id: generateId("task"),
      createdAt: new Date().toISOString(),
      comments: [],
    };
    persist({ ...data, tasks: [newTask, ...data.tasks] });
    logActivity("task", `${currentMember.name} created task: "${newTask.title}"`, currentMember.id, "tasks", newTask.id);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    if (!data) return;
    const task = data.tasks.find((t) => t.id === taskId);
    const updated = data.tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    persist({ ...data, tasks: updated });
    if (task && task.status !== status) {
      logActivity("task", `${currentMember.name} moved task "${task.title}" to ${status}`, currentMember.id, "tasks", taskId);
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!data) return;
    const updated = data.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    persist({ ...data, tasks: updated });
  };

  const deleteTask = (taskId: string) => {
    if (!data) return;
    const task = data.tasks.find((t) => t.id === taskId);
    persist({ ...data, tasks: data.tasks.filter((t) => t.id !== taskId) });
    if (task) {
      logActivity("task", `${currentMember.name} deleted task: "${task.title}"`, currentMember.id, "tasks");
    }
  };

  const toggleTaskChecklist = (taskId: string, checklistId: string) => {
    if (!data) return;
    const updated = data.tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        checklist: t.checklist.map((c) => (c.id === checklistId ? { ...c, done: !c.done } : c)),
      };
    });
    persist({ ...data, tasks: updated });
  };

  // Project & Roadmap
  const updateProject = (updates: Partial<Project>) => {
    if (!data) return;
    persist({ ...data, project: { ...data.project, ...updates } });
  };

  const updateStageStatus = (stageId: string, status: "Pending" | "In Progress" | "Completed") => {
    if (!data) return;
    const updated = data.stages.map((s) => (s.id === stageId ? { ...s, status } : s));
    persist({ ...data, stages: updated });
    const stage = data.stages.find((s) => s.id === stageId);
    if (stage) {
      logActivity("system", `Roadmap stage "${stage.name}" marked as ${status}`, currentMember.id, "roadmap");
    }
  };

  const toggleStageChecklist = (stageId: string, checklistId: string) => {
    if (!data) return;
    const updated = data.stages.map((s) => {
      if (s.id !== stageId) return s;
      return {
        ...s,
        checklist: s.checklist.map((c) => (c.id === checklistId ? { ...c, done: !c.done } : c)),
      };
    });
    persist({ ...data, stages: updated });
  };

  const addStage = (stageData: Omit<RoadmapStage, "id">) => {
    if (!data) throw new Error("Workspace not ready");
    const newStage: RoadmapStage = {
      ...stageData,
      id: generateId("stage"),
      order: stageData.order || data.stages.length + 1,
      checklist: stageData.checklist || [],
    };
    persist({ ...data, stages: [...data.stages, newStage] });
    logActivity("system", `Created roadmap milestone: "${newStage.name}"`, currentMember.id, "roadmap");
    return newStage;
  };

  const updateStage = (stageId: string, updates: Partial<RoadmapStage>) => {
    if (!data) return;
    const updated = data.stages.map((s) => (s.id === stageId ? { ...s, ...updates } : s));
    persist({ ...data, stages: updated });
    logActivity("system", `Updated milestone "${updates.name || "stage"}"`, currentMember.id, "roadmap");
  };

  const deleteStage = (stageId: string) => {
    if (!data) return;
    const target = data.stages.find((s) => s.id === stageId);
    persist({ ...data, stages: data.stages.filter((s) => s.id !== stageId) });
    logActivity("system", `Deleted milestone "${target?.name || stageId}"`, currentMember.id, "roadmap");
  };

  const addStageChecklistItem = (stageId: string, text: string) => {
    if (!data || !text.trim()) return;
    const updated = data.stages.map((s) => {
      if (s.id !== stageId) return s;
      return {
        ...s,
        checklist: [...s.checklist, { id: generateId("chk"), text: text.trim(), done: false }],
      };
    });
    persist({ ...data, stages: updated });
  };

  const deleteStageChecklistItem = (stageId: string, checklistId: string) => {
    if (!data) return;
    const updated = data.stages.map((s) => {
      if (s.id !== stageId) return s;
      return {
        ...s,
        checklist: s.checklist.filter((c) => c.id !== checklistId),
      };
    });
    persist({ ...data, stages: updated });
  };

  // Components & Inventory
  const addComponent = (compData: Omit<ComponentItem, "id" | "createdAt">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: ComponentItem = {
      ...compData,
      id: generateId("comp"),
      createdAt: new Date().toISOString(),
    };
    persist({ ...data, components: [item, ...data.components] });
    logActivity("component", `Added hardware component: "${item.name}"`, currentMember.id, "components", item.id);
    return item;
  };

  const updateComponent = (id: string, updates: Partial<ComponentItem>) => {
    if (!data) return;
    const updated = data.components.map((c) => (c.id === id ? { ...c, ...updates } : c));
    persist({ ...data, components: updated });
  };

  const deleteComponent = (id: string) => {
    if (!data) return;
    persist({ ...data, components: data.components.filter((c) => c.id !== id) });
  };

  // Experiments
  const addExperiment = (expData: Omit<Experiment, "id" | "createdAt" | "contributorId">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: Experiment = {
      ...expData,
      id: generateId("exp"),
      contributorId: currentMember.id,
      createdAt: new Date().toISOString(),
    };
    persist({ ...data, experiments: [item, ...data.experiments] });
    logActivity("experiment", `${currentMember.name} recorded ${item.experimentNumber}: "${item.title}" (${item.status})`, currentMember.id, "experiments", item.id);
    return item;
  };

  const updateExperimentStatus = (id: string, status: ExperimentStatus) => {
    if (!data) return;
    const exp = data.experiments.find((e) => e.id === id);
    const updated = data.experiments.map((e) => (e.id === id ? { ...e, status } : e));
    persist({ ...data, experiments: updated });
    if (exp) {
      logActivity("experiment", `Experiment ${exp.experimentNumber} marked as ${status}`, currentMember.id, "experiments", id);
    }
  };

  // Prototypes
  const addPrototypeVersion = (protoData: Omit<PrototypeVersion, "id">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: PrototypeVersion = {
      ...protoData,
      id: generateId("proto"),
    };
    persist({ ...data, prototypes: [item, ...data.prototypes] });
    logActivity("prototype", `Logged ${item.version} in Prototype Manager`, currentMember.id, "prototypes", item.id);
    return item;
  };

  const updatePrototypeStatus = (id: string, status: PrototypeStatus) => {
    if (!data) return;
    const proto = data.prototypes.find((p) => p.id === id);
    const updated = data.prototypes.map((p) => (p.id === id ? { ...p, status } : p));
    persist({ ...data, prototypes: updated });
    if (proto) {
      logActivity("prototype", `${proto.version} status updated to ${status}`, currentMember.id, "prototypes", id);
    }
  };

  // Decisions
  const recordDecision = (decData: Omit<DecisionRecord, "id" | "date" | "comments">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: DecisionRecord = {
      ...decData,
      id: generateId("dec"),
      date: new Date().toISOString().split("T")[0],
      comments: [],
    };
    persist({ ...data, decisions: [item, ...data.decisions] });
    logActivity("decision", `Recorded ${item.decisionNumber}: "${item.title}"`, currentMember.id, "decisions", item.id);
    return item;
  };

  // Wiki
  const addWikiArticle = (wikiData: Omit<WikiArticle, "id" | "updatedAt" | "authorId">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: WikiArticle = {
      ...wikiData,
      id: generateId("wiki"),
      authorId: currentMember.id,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    persist({ ...data, wiki: [item, ...data.wiki] });
    logActivity("system", `Created wiki article: "${item.title}"`, currentMember.id, "wiki", item.id);
    return item;
  };

  const updateWikiArticle = (id: string, content: string) => {
    if (!data) return;
    const updated = data.wiki.map((w) =>
      w.id === id ? { ...w, content, updatedAt: new Date().toISOString().split("T")[0] } : w
    );
    persist({ ...data, wiki: updated });
  };

  // Chat
  const sendChatMessage = (channelId: string, content: string, attachments?: string[]) => {
    if (!data || !content.trim()) return;
    const newMsg: ChatMessage = {
      id: generateId("msg"),
      channelId,
      senderId: currentMember.id,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      reactions: [],
      attachments: attachments || [],
    };
    persist({ ...data, chatMessages: [...data.chatMessages, newMsg] });
  };

  const addMessageReaction = (messageId: string, emoji: string) => {
    if (!data) return;
    const updated = data.chatMessages.map((m) => {
      if (m.id !== messageId) return m;
      const existing = m.reactions.find((r) => r.emoji === emoji);
      let newReactions;
      if (existing) {
        const hasUser = existing.users.includes(currentMember.id);
        const updatedUsers = hasUser
          ? existing.users.filter((uid) => uid !== currentMember.id)
          : [...existing.users, currentMember.id];
        newReactions = updatedUsers.length > 0
          ? m.reactions.map((r) => (r.emoji === emoji ? { ...r, users: updatedUsers } : r))
          : m.reactions.filter((r) => r.emoji !== emoji);
      } else {
        newReactions = [...m.reactions, { emoji, users: [currentMember.id] }];
      }
      return { ...m, reactions: newReactions };
    });
    persist({ ...data, chatMessages: updated });
  };

  // Budget
  const updateBudgetTotal = (total: number) => {
    if (!data) return;
    persist({ ...data, project: { ...data.project, budgetTotal: total } });
    logActivity("system", `Updated total team budget cap to $${total.toFixed(2)}`, currentMember.id, "budget");
  };

  const addExpense = (expData: Omit<BudgetExpense, "id" | "purchasedById">) => {
    if (!data) throw new Error("Workspace not ready");
    const item: BudgetExpense = {
      ...expData,
      id: generateId("exp-cost"),
      purchasedById: currentMember.id,
    };
    persist({ ...data, expenses: [item, ...data.expenses] });
    logActivity("system", `Logged expense: $${item.cost.toFixed(2)} for ${item.item}`, currentMember.id, "budget");
    return item;
  };

  const updateExpense = (id: string, updates: Partial<BudgetExpense>) => {
    if (!data) return;
    const updated = data.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e));
    persist({ ...data, expenses: updated });
    logActivity("system", `Updated expense: "${updates.item || "item"}"`, currentMember.id, "budget");
  };

  const deleteExpense = (id: string) => {
    if (!data) return;
    const target = data.expenses.find((e) => e.id === id);
    persist({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
    logActivity("system", `Deleted expense: "${target?.item || "item"}"`, currentMember.id, "budget");
  };

  // Achievements
  const addAchievement = (title: string, description: string, icon: string = "Trophy") => {
    if (!data) return;
    const item: TeamAchievement = {
      id: generateId("ach"),
      title,
      description,
      unlockedAt: new Date().toISOString().split("T")[0],
      icon,
      addedById: currentMember.id,
    };
    persist({ ...data, achievements: [item, ...data.achievements] });
    logActivity("achievement", `Achievement Unlocked: "${title}"!`, currentMember.id, "achievements");
  };

  // Files
  const uploadProjectFile = (name: string, category: ProjectFile["category"], size: string, url: string) => {
    if (!data) return;
    const newFile: ProjectFile = {
      id: generateId("file"),
      name,
      category,
      size,
      url,
      uploadedById: currentMember.id,
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    persist({ ...data, files: [newFile, ...data.files] });
    logActivity("system", `Uploaded file: ${name} (${size})`, currentMember.id, "files");
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    if (!data) return;
    const updated = data.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persist({ ...data, notifications: updated });
  };

  const clearAllNotifications = () => {
    if (!data) return;
    persist({ ...data, notifications: [] });
  };

  // Workspace Maintenance
  const resetToDemoData = () => {
    const demo = getDefaultWorkspaceData(true);
    persist(demo);
  };

  const clearToCleanState = () => {
    const clean = getDefaultWorkspaceData(false);
    persist(clean);
  };

  const exportWorkspaceJson = (): string => {
    if (!data) return "{}";
    return exportTeamDataToJson(data);
  };

  const importWorkspaceJson = (json: string): boolean => {
    const parsed = importTeamDataFromJson(json);
    if (parsed) {
      setData(parsed);
      return true;
    }
    return false;
  };

  // Universal Search
  const searchAllEntities = (query: string): UniversalSearchResult[] => {
    if (!data || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: UniversalSearchResult[] = [];

    // Search Ideas
    data.ideas.forEach((i) => {
      if (
        i.title.toLowerCase().includes(q) ||
        i.problem.toLowerCase().includes(q) ||
        i.proposedSolution.toLowerCase().includes(q) ||
        i.requiredHardware.toLowerCase().includes(q)
      ) {
        results.push({
          id: i.id,
          title: i.title,
          snippet: i.proposedSolution || i.problem,
          category: `Idea Vault (${i.status})`,
          tab: "ideas",
          date: i.createdAt,
        });
      }
    });

    // Search Research
    data.research.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.keyFindings.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: r.id,
          title: r.title,
          snippet: r.keyFindings || r.summary,
          category: `Research (${r.topic})`,
          tab: "research",
          date: r.createdAt,
        });
      }
    });

    // Search Tasks
    data.tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
        results.push({
          id: t.id,
          title: t.title,
          snippet: t.description,
          category: `Task (${t.status} - ${t.priority})`,
          tab: "tasks",
        });
      }
    });

    // Search Components
    data.components.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q)) ||
        c.storageLocation.toLowerCase().includes(q)
      ) {
        results.push({
          id: c.id,
          title: c.name,
          snippet: `Stock: ${c.quantityAvailable}/${c.quantityRequired} • Location: ${c.storageLocation}`,
          category: `Component (${c.status})`,
          tab: "components",
        });
      }
    });

    // Search Experiments
    data.experiments.forEach((e) => {
      if (
        e.title.toLowerCase().includes(q) ||
        e.experimentNumber.toLowerCase().includes(q) ||
        e.hypothesis.toLowerCase().includes(q) ||
        e.conclusion.toLowerCase().includes(q) ||
        e.measurements.toLowerCase().includes(q)
      ) {
        results.push({
          id: e.id,
          title: `${e.experimentNumber}: ${e.title}`,
          snippet: e.conclusion || e.hypothesis,
          category: `Experiment (${e.status})`,
          tab: "experiments",
          date: e.createdAt,
        });
      }
    });

    // Search Prototypes
    data.prototypes.forEach((p) => {
      if (
        p.version.toLowerCase().includes(q) ||
        p.objective.toLowerCase().includes(q) ||
        p.testResults.toLowerCase().includes(q) ||
        p.changes.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          title: p.version,
          snippet: p.changes || p.testResults,
          category: `Prototype (${p.status})`,
          tab: "prototypes",
          date: p.date,
        });
      }
    });

    // Search Decisions
    data.decisions.forEach((d) => {
      if (
        d.title.toLowerCase().includes(q) ||
        d.decisionNumber.toLowerCase().includes(q) ||
        d.decision.toLowerCase().includes(q) ||
        d.reason.toLowerCase().includes(q)
      ) {
        results.push({
          id: d.id,
          title: `${d.decisionNumber}: ${d.title}`,
          snippet: d.decision,
          category: "Decision Record (ADR)",
          tab: "decisions",
          date: d.date,
        });
      }
    });

    // Search Wiki
    data.wiki.forEach((w) => {
      if (w.title.toLowerCase().includes(q) || w.content.toLowerCase().includes(q)) {
        results.push({
          id: w.id,
          title: w.title,
          snippet: w.content.slice(0, 120),
          category: `Wiki (${w.category})`,
          tab: "wiki",
        });
      }
    });

    return results.slice(0, 25);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#080B11] flex items-center justify-center text-slate-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm tracking-wider uppercase text-cyan-400">Loading Byte Builders HQ...</span>
        </div>
      </div>
    );
  }

  return (
    <TeamContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isAuthenticated,
        loginWithCode,
        logout,
        teamCode,
        currentMember,
        setCurrentMemberId,
        updateMemberProfile,
        project: data.project,
        members: data.members,
        ideas: data.ideas,
        research: data.research,
        suggestions: data.suggestions,
        stages: data.stages,
        tasks: data.tasks,
        components: data.components,
        experiments: data.experiments,
        prototypes: data.prototypes,
        decisions: data.decisions,
        wiki: data.wiki,
        chatMessages: data.chatMessages,
        activityLogs: data.activityLogs,
        expenses: data.expenses,
        achievements: data.achievements,
        files: data.files,
        notifications: data.notifications,
        isDemoData: data.isDemoData,
        submitIdea,
        updateIdeaStatus,
        upvoteIdea,
        addIdeaComment,
        convertIdeaToProject,
        convertIdeaToTask,
        submitResearch,
        addResearchComment,
        submitSuggestion,
        supportSuggestion,
        updateSuggestionStatus,
        convertSuggestionToIdea,
        convertSuggestionToTask,
        createTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        toggleTaskChecklist,
        updateProject,
        updateStageStatus,
        toggleStageChecklist,
        addStage,
        updateStage,
        deleteStage,
        addStageChecklistItem,
        deleteStageChecklistItem,
        addComponent,
        updateComponent,
        deleteComponent,
        addExperiment,
        updateExperimentStatus,
        addPrototypeVersion,
        updatePrototypeStatus,
        recordDecision,
        addWikiArticle,
        updateWikiArticle,
        sendChatMessage,
        addMessageReaction,
        updateBudgetTotal,
        addExpense,
        updateExpense,
        deleteExpense,
        addAchievement,
        uploadProjectFile,
        markNotificationRead,
        clearAllNotifications,
        resetToDemoData,
        clearToCleanState,
        exportWorkspaceJson,
        importWorkspaceJson,
        isContributeOpen,
        setIsContributeOpen,
        isSearchOpen,
        setIsSearchOpen,
        isByteBotOpen,
        setIsByteBotOpen,
        isShareOpen,
        setIsShareOpen,
        searchAllEntities,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
