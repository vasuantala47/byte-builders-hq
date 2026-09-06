import {
  TeamMember,
  Idea,
  ResearchItem,
  Suggestion,
  Project,
  RoadmapStage,
  Task,
  ComponentItem,
  Experiment,
  PrototypeVersion,
  DecisionRecord,
  WikiArticle,
  ChatMessage,
  ActivityLog,
  BudgetExpense,
  TeamAchievement,
  ProjectFile,
  TeamNotification,
} from "@/types";
import {
  INITIAL_MEMBERS,
  INITIAL_PROJECT,
  INITIAL_IDEAS,
  INITIAL_RESEARCH,
  INITIAL_SUGGESTIONS,
  INITIAL_ROADMAP_STAGES,
  INITIAL_TASKS,
  INITIAL_COMPONENTS,
  INITIAL_EXPERIMENTS,
  INITIAL_PROTOTYPES,
  INITIAL_DECISIONS,
  INITIAL_WIKI_ARTICLES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ACTIVITY,
  INITIAL_EXPENSES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_FILES,
  INITIAL_NOTIFICATIONS,
} from "./initialData";

const STORAGE_KEY = "byte_builders_hq_data_v1";

export interface TeamWorkspaceData {
  version: string;
  lastUpdated: string;
  isDemoData: boolean;
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
}

export function getDefaultWorkspaceData(useDemo: boolean = true): TeamWorkspaceData {
  if (!useDemo) {
    return {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      isDemoData: false,
      project: {
        id: "proj-clean",
        title: "Byte Builders Hardware Innovation Lab",
        objective: "Define your hackathon project objective in Settings or Command Center.",
        problem: "No problem defined yet.",
        solution: "No solution defined yet.",
        status: "Planning",
        progress: 0,
        createdAt: new Date().toISOString(),
      },
      members: INITIAL_MEMBERS,
      ideas: [],
      research: [],
      suggestions: [],
      stages: INITIAL_ROADMAP_STAGES.map((s) => ({
        ...s,
        status: "Pending",
        checklist: s.checklist.map((c) => ({ ...c, done: false })),
      })),
      tasks: [],
      components: [],
      experiments: [],
      prototypes: [],
      decisions: [],
      wiki: [],
      chatMessages: [],
      activityLogs: [
        {
          id: "act-clean-init",
          type: "system",
          description: "Clean workspace initialized. Ready for hardware innovation.",
          memberId: "member-1",
          timestamp: new Date().toISOString(),
        },
      ],
      expenses: [],
      achievements: [INITIAL_ACHIEVEMENTS[0]],
      files: [],
      notifications: [],
    };
  }

  return {
    version: "1.0",
    lastUpdated: new Date().toISOString(),
    isDemoData: true,
    project: INITIAL_PROJECT,
    members: INITIAL_MEMBERS,
    ideas: INITIAL_IDEAS,
    research: INITIAL_RESEARCH,
    suggestions: INITIAL_SUGGESTIONS,
    stages: INITIAL_ROADMAP_STAGES,
    tasks: INITIAL_TASKS,
    components: INITIAL_COMPONENTS,
    experiments: INITIAL_EXPERIMENTS,
    prototypes: INITIAL_PROTOTYPES,
    decisions: INITIAL_DECISIONS,
    wiki: INITIAL_WIKI_ARTICLES,
    chatMessages: INITIAL_CHAT_MESSAGES,
    activityLogs: INITIAL_ACTIVITY,
    expenses: INITIAL_EXPENSES,
    achievements: INITIAL_ACHIEVEMENTS,
    files: INITIAL_FILES,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

export function loadWorkspaceData(): TeamWorkspaceData {
  if (typeof window === "undefined") {
    return getDefaultWorkspaceData(true);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultWorkspaceData(true);
      saveWorkspaceData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as TeamWorkspaceData;
    return parsed;
  } catch (err) {
    console.error("Failed to load workspace data from localStorage:", err);
    return getDefaultWorkspaceData(true);
  }
}

export function saveWorkspaceData(data: TeamWorkspaceData): void {
  if (typeof window === "undefined") return;
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save workspace data to localStorage:", err);
  }
}

export function exportTeamDataToJson(data: TeamWorkspaceData): string {
  return JSON.stringify(data, null, 2);
}

export function importTeamDataFromJson(jsonString: string): TeamWorkspaceData | null {
  try {
    const parsed = JSON.parse(jsonString) as TeamWorkspaceData;
    if (!parsed.members || !Array.isArray(parsed.members)) {
      throw new Error("Invalid team data format: missing members array");
    }
    saveWorkspaceData(parsed);
    return parsed;
  } catch (err) {
    console.error("Error importing JSON team data:", err);
    return null;
  }
}
