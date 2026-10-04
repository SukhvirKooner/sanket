/**
 * SANKET product walkthrough recorder — no overlays/callouts.
 * Looks like a real user using the app.
 * Outputs: recordings/sanket-walkthrough.webm + .mp4
 */
import { chromium } from "playwright";
import {
  mkdirSync,
  existsSync,
  readdirSync,
  copyFileSync,
  unlinkSync,
  rmSync,
  statSync,
} from "fs";
import { join } from "path";
import { execSync } from "child_process";

const BASE = process.env.SANKET_URL || "http://localhost:3000";
const OUT = join(process.cwd(), "recordings");
const RAW = join(OUT, "raw");

if (existsSync(RAW)) rmSync(RAW, { recursive: true, force: true });
mkdirSync(RAW, { recursive: true });
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function go(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await sleep(1100);
}

async function clickFirst(page, locator, label) {
  try {
    await locator.first().waitFor({ state: "visible", timeout: 8000 });
    await locator.first().scrollIntoViewIfNeeded();
    await locator.first().click({ timeout: 6000 });
    return true;
  } catch {
    console.warn(`· skip ${label}`);
    return false;
  }
}

async function waitText(page, re, ms = 15000) {
  try {
    await page.getByText(re).first().waitFor({ state: "visible", timeout: ms });
    return true;
  } catch {
    console.warn(`· wait miss: ${re}`);
    return false;
  }
}

async function scrollShow(page, amount = 380, wait = 1200) {
  await page.mouse.wheel(0, amount);
  await sleep(wait);
}

async function ensureAuth(page) {
  await page.evaluate(() => {
    let prev = {};
    try {
      prev = JSON.parse(localStorage.getItem("sanket-app-store") || "{}").state || {};
    } catch {}
    localStorage.setItem(
      "sanket-app-store",
      JSON.stringify({
        state: {
          ...prev,
          isAuthenticated: true,
          guidedTour: false,
          user: prev.user || {
            id: "user-government_planner",
            name: "Ananya Sharma",
            email: "ananya.sharma@msde.gov.in",
            role: "government_planner",
            org: "MSDE · Planning Cell",
          },
        },
        version: 0,
      })
    );
  });
}

async function setRole(page, user) {
  await page.evaluate((user) => {
    const raw = JSON.parse(localStorage.getItem("sanket-app-store") || "{}");
    raw.state = { ...(raw.state || {}), isAuthenticated: true, guidedTour: false, user };
    localStorage.setItem("sanket-app-store", JSON.stringify(raw));
  }, user);
}

async function navSidebar(page, name) {
  // Prefer left sidebar link (avoid workflow stepper duplicates)
  const link = page.locator("aside a").filter({ hasText: new RegExp(name, "i") });
  if (await link.count()) {
    await link.first().click();
    await sleep(1200);
    return true;
  }
  return false;
}

async function main() {
  console.log("Recording SANKET walkthrough against", BASE);

  const browser = await chromium.launch({
    headless: true,
    args: ["--window-size=1440,900"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: RAW, size: { width: 1440, height: 900 } },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: "networkidle" });
    await sleep(1500);

    // Login as planner via quick login button (real UI)
    await clickFirst(page, page.getByRole("button", { name: /Government Planner/i }), "login");
    await page.waitForURL("**/control-room**", { timeout: 20000 }).catch(() => {});
    await sleep(1200);
    await ensureAuth(page);

    // Control Room — browse then open alert
    await go(page, "/control-room");
    await waitText(page, /Control Room|Emerging demand|Workforce required/i, 20000);
    await sleep(1600);
    await scrollShow(page, 320);
    await scrollShow(page, 420);
    await clickFirst(
      page,
      page.getByText("Semiconductor workforce gap emerging in Gujarat"),
      "alert"
    );
    await sleep(1400);

    // Signals → event analysis
    if (!page.url().includes("/signals")) await go(page, "/signals");
    await waitText(page, /Economic Signals|Semiconductor Fabrication/i, 20000);
    await sleep(1400);
    await scrollShow(page, 180);
    await go(page, "/signals/evt-semiconductor");
    await ensureAuth(page);
    await waitText(page, /Economic Event Analysis|Occupation mix|Hiring ramp/i, 20000);
    await sleep(1800);
    await scrollShow(page, 300);
    await clickFirst(page, page.getByRole("button", { name: /Why this forecast/i }), "why");
    await sleep(2200);
    await clickFirst(page, page.getByText("Comparable projects"), "evidence");
    await sleep(1600);
    await page.keyboard.press("Escape");
    await sleep(500);
    await clickFirst(
      page,
      page.getByRole("button", { name: /Find Existing Workforce/i }),
      "find"
    );
    await sleep(1400);

    // Capability → worker
    if (!page.url().includes("/capability")) await go(page, "/capability");
    await ensureAuth(page);
    await waitText(page, /Capability Map|Directly deployable/i, 20000);
    await sleep(1400);
    await scrollShow(page, 260);
    await clickFirst(page, page.getByRole("button", { name: "View workers" }), "workers");
    await sleep(1000);
    await clickFirst(page, page.locator("button").filter({ hasText: /WRK-GJ/ }), "worker");
    await sleep(1200);

    if (!page.url().includes("/workers/")) await go(page, "/workers/wrk-001");
    await ensureAuth(page);
    await waitText(page, /Authorized access|Industrial Electrician/i, 20000);
    await sleep(1200);
    await clickFirst(page, page.getByRole("button", { name: /Reveal \(logged\)/i }), "reveal");
    await sleep(1600);
    await scrollShow(page, 480);
    await clickFirst(
      page,
      page.getByRole("button", { name: /Automation Technician/i }),
      "transform"
    );
    await sleep(1200);

    // Transformation
    if (!page.url().includes("/transformation")) await go(page, "/transformation");
    await ensureAuth(page);
    await waitText(page, /Transformation Lab|Bridge modules|Path A/i, 20000);
    await sleep(1200);
    await scrollShow(page, 420);
    await clickFirst(page, page.getByRole("button", { name: /Add to Activation Plan/i }), "add");
    await sleep(1600);

    // Training via sidebar
    if (!(await navSidebar(page, "Training Capacity"))) await go(page, "/training");
    await ensureAuth(page);
    await waitText(page, /Training Capacity|Available seats/i, 20000);
    await sleep(1400);
    await scrollShow(page, 320);
    await clickFirst(page, page.getByRole("button", { name: "Detail" }), "detail");
    await sleep(2000);
    await page.keyboard.press("Escape");
    await sleep(400);
    await scrollShow(page, 480);

    // Activation
    if (!(await navSidebar(page, "Activation Plans"))) await go(page, "/activation");
    await ensureAuth(page);
    await waitText(page, /Activation Plans|Generate Activation Plan/i, 20000);
    await sleep(1200);
    await clickFirst(page, page.getByRole("button", { name: /Generate Activation Plan/i }), "gen");
    await waitText(page, /Allocation|Workers activated|Batch timeline/i, 40000);
    await sleep(2000);
    await scrollShow(page, 400);

    // Scenarios
    if (!(await navSidebar(page, "Scenario Lab"))) await go(page, "/scenarios");
    await ensureAuth(page);
    await waitText(page, /Scenario Lab/i, 20000);
    await sleep(1200);
    await clickFirst(page, page.getByRole("button", { name: /Stress test/i }), "preset");
    await sleep(700);
    await clickFirst(page, page.getByRole("button", { name: /^Run Scenario$/i }), "run");
    await waitText(page, /Residual gap|Base vs Scenario/i, 12000);
    await sleep(2400);
    await page.getByPlaceholder("Scenario name").fill("Gujarat delay stress case").catch(() => {});
    await clickFirst(page, page.getByRole("button", { name: /^Save$/i }), "save");
    await sleep(1200);

    // Approvals
    if (!(await navSidebar(page, "Approvals"))) await go(page, "/approvals");
    await ensureAuth(page);
    await waitText(page, /Approval|AI recommends/i, 20000);
    await sleep(1400);
    await clickFirst(page, page.getByRole("button", { name: /^MODIFY$/i }), "modify");
    await sleep(800);
    const num = page.locator('input[type="number"]').first();
    if (await num.count()) await num.fill("190");
    await page
      .getByPlaceholder(/Document why/i)
      .fill("Increase Ahmedabad cohort by 10 to use spare Automation seats at ITI Vadodara.")
      .catch(() => {});
    await sleep(1200);
    await clickFirst(page, page.getByRole("button", { name: /Submit modification/i }), "submit");
    await sleep(600);
    await clickFirst(page, page.getByRole("button", { name: /^Confirm$/i }), "confirm");
    await sleep(1500);

    // Implementation
    if (!page.url().includes("/implementation")) {
      if (!(await navSidebar(page, "Implementation"))) await go(page, "/implementation");
    }
    await ensureAuth(page);
    await waitText(page, /Implementation|Funnel|Placed/i, 20000);
    await sleep(1400);
    await scrollShow(page, 400);
    await scrollShow(page, 420);

    // Outcomes
    if (!(await navSidebar(page, "Outcomes"))) await go(page, "/outcomes");
    await ensureAuth(page);
    await waitText(page, /Outcome|Forecast error|Reality Loop/i, 20000);
    await sleep(1400);
    await scrollShow(page, 280);
    await clickFirst(page, page.getByRole("button", { name: /Recalibrate Forecast/i }), "recal");
    await sleep(6500);
    await sleep(1200);

    // Evidence
    if (!(await navSidebar(page, "Evidence"))) await go(page, "/evidence");
    await ensureAuth(page);
    await waitText(page, /Evidence & Audit|Audit trail/i, 20000);
    await sleep(1600);
    await scrollShow(page, 260);
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        /generated|approved|Scenario|recalibrat|Login|Added|accessed|Reveal|modified|Sent/i.test(
          b.textContent || ""
        )
      );
      btn?.click();
    });
    await sleep(1600);
    await clickFirst(page, page.getByRole("button", { name: /Export CSV/i }), "csv");
    await sleep(900);

    // Admin as administrator
    await setRole(page, {
      id: "user-administrator",
      name: "Suresh Iyer",
      email: "suresh.iyer@sanket.gov.in",
      role: "administrator",
      org: "SANKET Platform Ops",
    });
    await go(page, "/admin");
    await waitText(page, /Administration|Users/i, 20000);
    await sleep(1400);
    for (const tab of ["Data Sources", "Model Versions", "Skill Ontology", "Occupation Mapping"]) {
      await clickFirst(page, page.getByRole("tab", { name: tab }), tab);
      await sleep(1100);
    }

    // Training authority
    await setRole(page, {
      id: "user-training_authority",
      name: "Ravi Mehta",
      email: "ravi.mehta@gujarat-skill.gov.in",
      role: "training_authority",
      org: "Gujarat Skill Development Mission",
    });
    await go(page, "/control-room");
    await sleep(1500);
    await go(page, "/training");
    await sleep(1600);

    // Employer
    await setRole(page, {
      id: "user-employer",
      name: "Priya Nair",
      email: "priya.nair@dholera-semi.in",
      role: "employer",
      org: "Dholera Semi Fab Pvt Ltd",
    });
    await go(page, "/signals");
    await sleep(1800);

    // Back to planner control room
    await setRole(page, {
      id: "user-government_planner",
      name: "Ananya Sharma",
      email: "ananya.sharma@msde.gov.in",
      role: "government_planner",
      org: "MSDE · Planning Cell",
    });
    await go(page, "/control-room");
    await sleep(2200);

    console.log("Walkthrough script finished cleanly");
  } catch (err) {
    console.error("Walkthrough error:", err.message);
    await page.screenshot({ path: join(OUT, "error.png"), fullPage: true }).catch(() => {});
  } finally {
    await page.close().catch(() => {});
    await context.close();
    await browser.close();
  }

  const files = readdirSync(RAW).filter((f) => f.endsWith(".webm"));
  if (!files.length) throw new Error("No video recorded");
  const sorted = files
    .map((f) => ({ f, s: statSync(join(RAW, f)).size }))
    .sort((a, b) => b.s - a.s);
  const src = join(RAW, sorted[0].f);
  const webm = join(OUT, "sanket-walkthrough.webm");
  copyFileSync(src, webm);
  console.log(`Saved ${webm} (${Math.round(sorted[0].s / 1024 / 1024)} MB)`);

  const mp4 = join(OUT, "sanket-walkthrough.mp4");
  execSync(
    `ffmpeg -y -i "${webm}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "${mp4}"`,
    { stdio: "inherit" }
  );
  const dur = execSync(
    `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${mp4}"`,
    { encoding: "utf8" }
  ).trim();
  console.log(`Saved ${mp4}`);
  console.log(`Duration: ${Math.round(Number(dur))}s (~${(Number(dur) / 60).toFixed(1)} min)`);

  for (const f of readdirSync(RAW)) {
    try {
      unlinkSync(join(RAW, f));
    } catch {}
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
