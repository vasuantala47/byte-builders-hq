export type TabType =
  | "command-center"
  | "ideas"
  | "research"
  | "suggestions"
  | "projects"
  | "roadmap"
  | "tasks"
  | "hardware"
  | "experiments"
  | "prototypes"
  | "components"
  | "budget"
  | "wiki"
  | "decisions"
  | "chat"
  | "activity"
  | "achievements"
  | "files"
  | "team"
  | "settings";

export interface TeamMember {
  id: string;
  name: string;
  callsign: string;
  avatar: string;
  bio: string;
  skills: string[];
  online: boolean;
  joinedAt: string;
  contributionsCount: number;
}

export interface CommentItem {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  reactions?: { emoji: string; users: string[] }[];
}

export type IdeaStatus =
  | "New"
  | "Discussing"
  | "Promising"
  | "Selected"
  | "Building"
  | "Testing"
  | "Implemented"
  | "Rejected";

export interface Idea {
  id: string;
  title: string;
  problem: string;
  proposedSolution: string;
  explanation: string;
  howItWorks: string;
  requiredHardware: string;
  requiredSoftware: string;
  estimatedCost: number;
  advantages: string;
  risks: string;
  questions: string;
  references: string;
  authorId: string;
  createdAt: string;
  status: IdeaStatus;
  upvotes: string[]; // member IDs
  comments: CommentItem[];
  linkedProjectId?: string;
  tags?: string[];
  images?: string[];
}

export interface ResearchItem {
  id: string;
  title: string;
  topic: string;
  summary: string;
  keyFindings: string;
  whatWeLearned: string;
  howItHelps: string;
  sourceUrl: string;
  tags: string[];
  authorId: string;
  createdAt: string;
  attachments?: string[];
  comments: CommentItem[];
}

export type SuggestionStatus = "Open" | "Discussing" | "Accepted" | "Implemented" | "Rejected";

export interface Suggestion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  status: SuggestionStatus;
  supports: string[]; // member IDs
  comments: CommentItem[];
}

export interface Project {
  id: string;
  title: string;
  objective: string;
  problem: string;
  solution: string;
  status: "Planning" | "Active" | "Testing" | "Completed";
  leadId?: string;
  deadline?: string;
  progress: number;
  createdAt: string;
  tags?: string[];
}

export interface RoadmapStage {
  id: string;
  order: number;
  name: string;
  description: string;
  ownerId?: string;
  deadline?: string;
  status: "Pending" | "In Progress" | "Completed";
  checklist: { id: string; text: string; done: boolean }[];
  notes?: string;
}

export type TaskStatus = "BACKLOG" | "TODO" | "IN PROGRESS" | "REVIEW" | "TESTING" | "DONE";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  checklist: { id: string; text: string; done: boolean }[];
  relatedProjectId?: string;
  relatedIdeaId?: string;
  relatedExperimentId?: string;
  comments: CommentItem[];
  createdAt: string;
}

export type ComponentCategory =
  | "Microcontroller"
  | "Sensor"
  | "Actuator"
  | "Power"
  | "Passive"
  | "Mechanical"
  | "PCB"
  | "Communication"
  | "Other";

export type ComponentStatus =
  | "Needed"
  | "Searching"
  | "Ordered"
  | "Received"
  | "Testing"
  | "Available"
  | "Installed";

export interface ComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  quantityRequired: number;
  quantityAvailable: number;
  status: ComponentStatus;
  estimatedPrice: number;
  actualPrice: number;
  supplier: string;
  link: string;
  purchasedById?: string;
  storageLocation: string;
  notes?: string;
  createdAt: string;
}

export type ExperimentStatus =
  | "Planned"
  | "Running"
  | "Successful"
  | "Failed"
  | "Needs Improvement";

export interface Experiment {
  id: string;
  experimentNumber: string;
  title: string;
  objective: string;
  hypothesis: string;
  setup: string;
  componentsUsed: string[];
  expectedResult: string;
  actualResult: string;
  measurements: string;
  problems: string;
  conclusion: string;
  status: ExperimentStatus;
  mediaUrls: string[];
  nextExperiment?: string;
  contributorId: string;
  createdAt: string;
}

export type PrototypeStatus =
  | "In Design"
  | "Fabricating"
  | "Testing"
  | "Verified"
  | "Superseded";

export interface PrototypeVersion {
  id: string;
  version: string;
  date: string;
  objective: string;
  changes: string;
  components: string[];
  designFiles: string[];
  photos: string[];
  testResults: string;
  problems: string;
  improvements: string;
  status: PrototypeStatus;
}

export interface DecisionRecord {
  id: string;
  decisionNumber: string;
  title: string;
  decision: string;
  reason: string;
  alternatives: string;
  decisionMadeBy: string;
  date: string;
  status: "Proposed" | "Accepted" | "Superseded";
  comments: CommentItem[];
}

export type WikiCategory =
  | "Electronics"
  | "Sensors"
  | "Microcontrollers"
  | "Programming"
  | "Mechanical"
  | "Power"
  | "IoT"
  | "AI/ML"
  | "Manufacturing"
  | "Materials"
  | "Documentation"
  | "Hackathon"
  | "Useful References";

export interface WikiArticle {
  id: string;
  title: string;
  category: WikiCategory;
  content: string;
  tags: string[];
  authorId: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string; // 'general' | 'hardware' | 'firmware' | 'testing' | 'announcements'
  senderId: string;
  content: string;
  timestamp: string;
  reactions: { emoji: string; users: string[] }[];
  replyToId?: string;
  attachments?: string[];
}

export interface ActivityLog {
  id: string;
  type:
    | "idea"
    | "research"
    | "suggestion"
    | "task"
    | "experiment"
    | "prototype"
    | "component"
    | "decision"
    | "achievement"
    | "system";
  description: string;
  memberId: string;
  timestamp: string;
  linkTab?: TabType;
  linkId?: string;
}

export interface BudgetExpense {
  id: string;
  item: string;
  category: string;
  quantity: number;
  cost: number;
  date: string;
  purchasedById: string;
  receiptUrl?: string;
  notes?: string;
}

export interface TeamAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
  addedById: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  category:
    | "Images"
    | "Videos"
    | "PDFs"
    | "CAD"
    | "Circuits"
    | "Datasheets"
    | "Code"
    | "Docs"
    | "Slides";
  size: string;
  url: string;
  uploadedById: string;
  uploadedAt: string;
  relatedEntityId?: string;
}

export interface TeamNotification {
  id: string;
  memberId?: string; // undefined means all
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: TabType;
}

export interface UniversalSearchResult {
  id: string;
  title: string;
  snippet: string;
  category: string;
  tab: TabType;
  date?: string;
}
