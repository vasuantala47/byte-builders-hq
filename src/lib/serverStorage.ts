import fs from "fs";
import path from "path";
import os from "os";
import { TeamWorkspaceData, getDefaultWorkspaceData } from "./storage";

// On Vercel / serverless, process.cwd() is read-only. Use os.tmpdir() when deployed.
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "byte_builders_data")
  : path.join(process.cwd(), "data");

const DATA_FILE = path.join(DATA_DIR, "workspace.json");

// In-memory cache for ultra-fast response
let memoryData: TeamWorkspaceData | null = null;

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Non-fatal if filesystem is restricted
    console.warn("Notice: could not create storage directory, using memory cache:", err);
  }
}

export function getServerWorkspaceData(): TeamWorkspaceData {
  if (memoryData) {
    return memoryData;
  }

  ensureDataDirectory();

  // Try reading bundled demo file from process.cwd()/data if present
  const bundledFile = path.join(process.cwd(), "data", "workspace.json");
  if (fs.existsSync(bundledFile)) {
    try {
      const raw = fs.readFileSync(bundledFile, "utf-8");
      memoryData = JSON.parse(raw);
      return memoryData!;
    } catch (err) {
      console.warn("Could not read bundled workspace file:", err);
    }
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      memoryData = JSON.parse(raw);
      return memoryData!;
    } catch (err) {
      console.warn("Could not read tmp workspace file:", err);
    }
  }

  // Fallback to default demo dataset
  memoryData = getDefaultWorkspaceData(true);
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2), "utf-8");
  } catch (err) {
    // Graceful fallback to in-memory only
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
    // Gracefully persist in memory
    console.warn("Could not write to disk, saved in memory:", err);
  }

  return updated;
}
