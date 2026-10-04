# SANKET · Workforce Command Centre

AI-enabled Workforce Intelligence & Activation Engine for India — web command centre for planners, training authorities, employers, and administrators.

## Stack

- Next.js 14 (App Router) · React · TypeScript
- Tailwind CSS · Radix/shadcn-style UI · Recharts
- Zustand · Framer Motion · Lucide

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sign in

Any credentials work. Use **Quick login → Government Planner** to enter the command centre, then walk the journey from the sidebar (or enable the guided coach-marks in the header).

## Journey

Control Room → Economic Signals → Event Analysis → Capability → Worker → Transformation → Training → Activation → Scenario → Approval → Implementation → Outcomes → Evidence & Audit

## iOS worker app

Open `SANKET.xcodeproj` in Xcode (iOS 17+ simulator).

```bash
# regenerate project if needed
xcodegen generate
```

## Record a walkthrough

**Web** (app running locally):

```bash
npm run record:walkthrough
```

Output: `recordings/sanket-walkthrough.mp4`

**iOS** (simulator booted):

```bash
python3 record_walkthrough.py
```

Output: `Walkthrough/SANKET_Walkthrough.mp4`
