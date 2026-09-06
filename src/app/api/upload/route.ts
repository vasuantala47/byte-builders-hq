import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function detectCategory(filename: string): "Circuits" | "CAD" | "Datasheets" | "Code" | "Images" | "Docs" | "Videos" | "Slides" {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (["kicad_pcb", "kicad_sch", "sch", "brd", "gerber", "gbr", "drl"].includes(ext)) return "Circuits";
  if (["step", "stp", "stl", "obj", "f3d", "dxf", "dwg"].includes(ext)) return "CAD";
  if (["pdf"].includes(ext)) return "Datasheets";
  if (["c", "cpp", "h", "hpp", "ino", "py", "rs", "ts", "js", "json", "yaml"].includes(ext)) return "Code";
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) return "Images";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "Videos";
  if (["ppt", "pptx", "key"].includes(ext)) return "Slides";
  return "Docs";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = process.env.VERCEL
      ? path.join(os.tmpdir(), "byte_builders_uploads")
      : path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Clean up file name and add unique prefix to avoid collision
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") || host.startsWith("10.") || host.startsWith("192.") ? "http" : "https";
    const relativeUrl = `/api/files/${uniqueName}`;
    const absoluteUrl = `${protocol}://${host}${relativeUrl}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      absoluteUrl,
      name: file.name,
      fileName: uniqueName,
      size: formatBytes(file.size),
      sizeBytes: file.size,
      category: detectCategory(file.name),
      type: file.type,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process file upload" },
      { status: 500 }
    );
  }
}
