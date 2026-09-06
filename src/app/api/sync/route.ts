import { NextRequest, NextResponse } from "next/server";
import { getServerWorkspaceData, saveServerWorkspaceData } from "@/lib/serverStorage";
import { TeamWorkspaceData } from "@/lib/storage";

export async function GET() {
  try {
    const data = getServerWorkspaceData();
    return NextResponse.json({
      success: true,
      data,
      timestamp: data.lastUpdated,
    });
  } catch (error: any) {
    console.error("GET /api/sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch workspace state" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientData = body.data as TeamWorkspaceData;

    if (!clientData || !clientData.members) {
      return NextResponse.json(
        { success: false, error: "Invalid workspace data payload" },
        { status: 400 }
      );
    }

    const saved = saveServerWorkspaceData(clientData);

    return NextResponse.json({
      success: true,
      data: saved,
      timestamp: saved.lastUpdated,
    });
  } catch (error: any) {
    console.error("POST /api/sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync workspace state" },
      { status: 500 }
    );
  }
}
