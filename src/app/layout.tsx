import type { Metadata } from "next";
import "./globals.css";
import { TeamProvider } from "@/context/TeamContext";

export const metadata: Metadata = {
  title: "Byte Builders HQ • Digital Hardware Innovation Lab",
  description:
    "Private collaborative digital hardware innovation lab and workspace for the Byte Builders 6-member engineering team. Think. Research. Build. Improve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080B11] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <TeamProvider>{children}</TeamProvider>
      </body>
    </html>
  );
}
