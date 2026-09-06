import fs from "fs";
import path from "path";
import { TeamWorkspaceData, getDefaultWorkspaceData } from "./storage";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "workspace.json");

// In-memory cache for ultra-fast response
let memoryData: TeamWorkspaceData | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getServerWorkspaceData(): TeamWorkspaceData {
  if (memoryData) {
    return memoryData;
  }

  ensureDataDirectory();

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      memoryData = JSON.parse(raw);
      return memoryData!;
    } catch (err) {
      console.error("Error reading server workspace data file, resetting:", err);
    }
  }

  // If no file exists, initialize with default demo dataset
  memoryData = getDefaultWorkspaceData(true);
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing initial workspace data:", err);
  }

  return memoryData;
}

export function saveServerWorkspaceData(data: TeamWorkspaceData): TeamWorkspaceData {
  ensureDataDirectory();

  const updated: TeamWorkspaceData = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  memoryData = updated;

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Error persisting server workspace data to file:", err);
  }

  return updated;
}
