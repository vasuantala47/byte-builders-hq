import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitized = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", sanitized);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = sanitized.split(".").pop()?.toLowerCase() || "";

    const contentTypeMap: Record<string, string> = {
      pdf: "application/pdf",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      webp: "image/webp",
      gif: "image/gif",
      step: "application/octet-stream",
      stp: "application/octet-stream",
      stl: "application/octet-stream",
      txt: "text/plain",
      json: "application/json",
      cpp: "text/plain",
      c: "text/plain",
      ino: "text/plain",
      py: "text/plain",
      kicad_sch: "text/plain",
      kicad_pcb: "text/plain",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${sanitized}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
