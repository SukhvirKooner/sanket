export const adminUsers = [
  { id: "u1", name: "Ananya Sharma", role: "Government Planner", org: "MSDE", status: "Active" },
  { id: "u2", name: "Ravi Mehta", role: "Training Authority", org: "GSDM", status: "Active" },
  { id: "u3", name: "Priya Nair", role: "Employer", org: "Dholera Semi Fab", status: "Active" },
  { id: "u4", name: "Suresh Iyer", role: "Administrator", org: "SANKET Ops", status: "Active" },
  { id: "u5", name: "Meera Joshi", role: "Government Planner", org: "MSDE · Gujarat Cell", status: "Invited" },
];

export const permissionMatrix = [
  { action: "Create economic event", planner: true, training: false, employer: true, admin: false },
  { action: "Run demand forecast", planner: true, training: false, employer: false, admin: false },
  { action: "View worker profiles", planner: true, training: false, employer: false, admin: false },
  { action: "Edit training seats", planner: false, training: true, employer: false, admin: true },
  { action: "Approve activation plans", planner: true, training: false, employer: false, admin: false },
  { action: "Recalibrate models", planner: true, training: false, employer: false, admin: true },
  { action: "Manage users", planner: false, training: false, employer: false, admin: true },
  { action: "View audit log", planner: true, training: true, employer: false, admin: true },
];

export const dataSources = [
  { name: "DPIIT Project Tracker", type: "PUBLIC", lastSync: "2026-09-28 06:00", health: "Healthy" },
  { name: "Skill India Digital", type: "PUBLIC", lastSync: "2026-09-28 05:30", health: "Healthy" },
  { name: "NSDC Centre Registry", type: "PUBLIC", lastSync: "2026-09-27 22:00", health: "Healthy" },
  { name: "Employer MoU Feed", type: "PARTNER", lastSync: "2026-09-28 08:15", health: "Degraded" },
  { name: "Job Board Aggregator", type: "PARTNER", lastSync: "2026-09-28 07:00", health: "Healthy" },
  { name: "Demo Workforce Graph", type: "SYNTHETIC", lastSync: "2026-09-28 00:00", health: "Healthy" },
];

export const modelVersions = [
  { version: "Demand Model v0.5", accuracy: "—", status: "Candidate", notes: "Post-recalibration" },
  { version: "Demand Model v0.4", accuracy: "78%", status: "Active", notes: "Current production" },
  { version: "Demand Model v0.3", accuracy: "74%", status: "Retired", notes: "Superseded Aug 2026" },
  { version: "Capability Matcher v1.2", accuracy: "81%", status: "Active", notes: "Skill ontology aligned" },
  { version: "Activation Optimizer v0.4", accuracy: "—", status: "Active", notes: "MILP demo simulator" },
];

export const skillOntology = [
  {
    name: "Electrical Systems",
    children: ["PLC", "Motor Control", "Power Distribution", "Troubleshooting"],
  },
  {
    name: "EV Technician",
    children: ["BMS", "Battery Diagnostics", "Powertrain", "Charging Systems"],
  },
  {
    name: "Automation",
    children: ["PLC Fundamentals", "SCADA", "Robotics Basics", "Control Systems"],
  },
  {
    name: "Industrial Safety",
    children: ["Lockout-Tagout", "PPE Standards", "Hazard Analysis"],
  },
];

export const occupationMapping = [
  {
    standard: "Industrial Electrician",
    nco: "7411.0100",
    aliases: [
      "Electrician",
      "Electrical Technician",
      "Industrial Electrician",
      "Electrical Maintenance Technician",
    ],
  },
  {
    standard: "Automation Technician",
    nco: "3139.0200",
    aliases: ["PLC Technician", "Automation Tech", "Control Systems Technician"],
  },
  {
    standard: "EV Technician",
    nco: "7231.0500",
    aliases: ["EV Service Tech", "Electric Vehicle Technician", "Battery Technician"],
  },
];
