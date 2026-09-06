import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    platform: "Byte Builders HQ",
    tagline: "Think. Research. Build. Improve.",
    timestamp: new Date().toISOString(),
  });
}
