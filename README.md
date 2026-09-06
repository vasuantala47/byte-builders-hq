# Byte Builders HQ ⚡
> **Think. Research. Build. Improve.**  
> *Our Digital Hardware Innovation Lab & Collaboration Workspace*

A modern, responsive, engineering-focused full-stack platform built for a 6-member hardware hackathon team. Built with **Next.js 15, React 19, TypeScript, Tailwind CSS, Google Gemini AI, and Supabase**.

---

## 🌟 Features Overview

### 1. Command Center (Collective Engineering Brain)
- Answers the 4 core questions:
  1. **What are we building?** (Hackathon problem statement & project mission)
  2. **Where are we now?** (Overall progress percentage, current phase, prototype generation, budget burn)
  3. **What happened recently?** (Recent ideas, latest test logs, active experiments)
  4. **What should we do next?** (Next priority actions, upcoming deadlines, blockers)
- Prominent **“＋ Contribute”** Quick Action modal: Submit Idea, Add Research, Post Suggestion, Log Experiment, Create Task, Add Plan, Add Component, Record Achievement.
- Real-time team presence indicator for all 6 equal contributors.

### 2. Embedded Gemini AI Hardware Engineering Copilot ("ByteBot")
- Integrated with Google Gemini models (`gemini-2.5-flash` / `gemini-2.5-pro`).
- Ask anything about:
  - ESP32-S3 / STM32 / Arduino firmware and FreeRTOS task optimization
  - Circuit schematics, LDO vs Buck regulators, and decoupling capacitor placement
  - I2C pull-up calculations (400kHz fast mode) and SPI bus signal integrity
  - Battery longevity & LiPo sizing formulas
  - Micro-venturi airflow geometry and 3D printing in PETG/ABS
  - **AI Task Decomposition**: One-click automatic breakdown of high-level Kanban tasks into concrete hardware checklist items.

### 3. Idea Vault & Idea Graveyard
- Full idea lifecycle: `New` → `Discussing` → `Promising` → `Selected` → `Building` → `Testing` → `Implemented` → `Rejected`.
- Permanent **Idea Graveyard / Archive** so past concepts are never lost and lessons learned are preserved.
- Upvotes, discussions, and 1-click conversion into a **Primary Project** or **Kanban Task**.

### 4. Research Hub
- Tagged repository for datasheets, papers, tutorials, and competitive teardowns.
- Topics: Hardware, Electronics, Sensors, Microcontrollers, Power, Mechanical, IoT, AI, Communication, Manufacturing.

### 5. Open Suggestions Board
- Lightweight rapid suggestions board with voting, comments, and promotion to Ideas or Tasks.

### 6. Task System (6-Column Kanban Board)
- 6 columns: `BACKLOG`, `TODO`, `IN PROGRESS`, `REVIEW`, `TESTING`, `DONE`.
- Prioritization (Critical, High, Medium, Low), assignees, checklists, and AI Task Breakdown.

### 7. Hardware Lab & Component Inventory
- Part name, category, quantity needed vs available, unit/total costs, supplier links, storage bin/box location.
- **Critical Stock Shortage Alert**: Automatic red warning banner when `required > available`.

### 8. Experiment Lab & Searchable Failure Library
- Scientific test protocols: Hypothesis, benchtop setup, components used, expected vs actual measurements, conclusions.
- Dedicated **Failure Library & Lessons Learned** filter so past mistakes lead to rapid improvements.

### 9. Prototype Manager (Physical Evolution Timeline)
- Physical version tracking: Prototype V0 (Breadboard) → Prototype V1 (Perfboard) → Prototype V2 (Milled PCB / CAD Pod) → V3 → Final.
- Photo galleries, revision changes, test results, and weight tracking.

### 10. Technical Decision Log (ADR)
- Architectural Decision Records (ADRs) with rationale, alternatives considered, and unanimous team consensus.

### 11. Internal Knowledge Base (Wiki)
- Categorized articles: ESP32-S3 pinouts, battery life formulas, I2C level shifting, and PETG slicing guides.

### 12. Team Chat & Activity Feed
- Real-time team messaging channels (`#general-lab`, `#hardware-bringup`, `#firmware-esp32`, `#flight-testing`) with emoji reactions.
- Full chronological audit feed of every team action.

### 13. Budget Tracker
- Total estimated budget, total spent, remaining funds, and itemized purchase receipts.

### 14. Achievements Timeline
- Milestone celebrations with interactive confetti triggers.

### 15. Universal Search (`Ctrl+K` / `Cmd+K`)
- Instant cross-entity indexing across Ideas, Research, Tasks, Components, Experiments, Prototypes, Decisions, and Wiki.

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- **Node.js**: v18.0 or newer (tested on Node v24.20)
- **npm**: v9.0 or newer

### 2. Installation
```bash
# Clone or navigate to the project directory
cd Hackathon

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
# Gemini API Key (Included for ByteBot AI Copilot)
GEMINI_API_KEY=your_gemini_api_key_here

# Team Access Code
NEXT_PUBLIC_TEAM_ACCESS_CODE=BYTE-BUILDERS-2025

# Optional: Supabase Connection (Leave blank to use built-in real-time browser storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase PostgreSQL Setup (Production)

The platform comes with a complete production SQL migration file: `supabase_schema.sql`.

1. Create a free project at [supabase.com](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase_schema.sql` from this repository, paste the contents into the SQL Editor, and click **Run**.
4. Copy your **Project URL** and **Anon Key** from `Project Settings -> API`.
5. Add them to `.env.local` or your Vercel Environment Variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🌐 Deploy to Vercel

1. Push your repository to **GitHub** (see instructions below).
2. Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
3. Click **"Add New Project"** and select `byte-builders-hq`.
4. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_TEAM_ACCESS_CODE` (e.g. `BYTE-BUILDERS-2025`)
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
5. Click **Deploy**. Vercel will build and assign you a free production URL (e.g., `https://byte-builders-hq.vercel.app`).

---

## 📦 How to Publish & Share on GitHub

To publish this codebase to GitHub so all 6 team members can clone, fork, and collaborate:

### Step 1: Install Git (if not already installed)
Download and install Git from [git-scm.com](https://git-scm.com/) or via Windows Package Manager:
```powershell
winget install --id Git.Git -e --source winget
```

### Step 2: Initialize Repository and Commit
```bash
git init
git add .
git commit -m "Initial release of Byte Builders HQ"
```

### Step 3: Create GitHub Repository & Push
1. Go to [github.com/new](https://github.com/new).
2. Name your repository: `byte-builders-hq`.
3. Set visibility to **Public** or **Private**.
4. Run the following commands:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/byte-builders-hq.git
git push -u origin main
```

Now all 6 members can clone and run it:
```bash
git clone https://github.com/YOUR_USERNAME/byte-builders-hq.git
cd byte-builders-hq
npm install
npm run dev
```

---

## 👥 The Byte Builders Team
All 6 members are equal partners in innovation:
- **Alex Rivera** (`Spark`) — Firmware, Real-Time C++, Sensors
- **Maya Chen** (`Flux`) — PCB Layout, RF Communication, Power Regulation
- **Liam Patel** (`Logic`) — Microcontrollers, Communication Protocols, Battery Longevity
- **Elena Rostova** (`Vector`) — 3D CAD, Mechanical Enclosures, Thermal Dissipation
- **Marcus Adebayo** (`Pulse`) — Edge AI, TinyML, Wireless Sensor Telemetry
- **Sofia Torres** (`Relay`) — Bench Testing, Signal Integrity, Component Sourcing

---

## 🛡️ Security & Privacy
- Protected by Team Invitation Code: `BYTE-BUILDERS-2025`.
- Client credentials remain local or server-proxied.
- Full backup export/import allows 100% offline data portability.
