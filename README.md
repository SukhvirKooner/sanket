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

The worker-facing iOS app lives in [sanket-worker-ios](https://github.com/SukhvirKooner/sanket-worker-ios).

## Record a walkthrough

Recordings stay on your machine (gitignored) and are not published to GitHub.

**Web** (app running locally):

```bash
npm run record:walkthrough
```

Writes `recordings/sanket-walkthrough.mp4` locally.

**iOS** (simulator booted):

```bash
python3 record_walkthrough.py
```

Writes `Walkthrough/SANKET_Walkthrough.mp4` locally.
