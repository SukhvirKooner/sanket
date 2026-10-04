#!/usr/bin/env python3
"""
Walkthrough recording of SANKET Worker.

Important: never opens the Presenter controls sheet. Stage changes use silent
URL hooks (sanket://…) so presenters' hidden controls stay off-camera.
"""

from __future__ import annotations

import json
import signal
import subprocess
import sys
import time
from pathlib import Path

UDID = "96328A7C-9DEE-4427-8F71-BFEEFD9BF89E"
BUNDLE = "com.sanket.worker"
OUT = Path("/Users/sukhvirsingh/webdev/SANKET/Walkthrough/SANKET_Walkthrough.mp4")

TABS = {
    "home": (40, 815),
    "opportunities": (121, 815),
    "skills": (201, 815),
    "training": (281, 815),
    "jobs": (362, 815),
}


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    print("+", " ".join(cmd), flush=True)
    return subprocess.run(cmd, check=check, capture_output=True, text=True)


def idb(*args: str, check: bool = True) -> subprocess.CompletedProcess:
    return run(["idb", *args, "--udid", UDID], check=check)


def sleep(s: float, note: str = "") -> None:
    if note:
        print(f"… {note} ({s:.1f}s)", flush=True)
    time.sleep(s)


def describe() -> list[dict]:
    return json.loads(idb("ui", "describe-all").stdout)


def labels() -> list[str]:
    return [e.get("AXLabel") or "" for e in describe() if e.get("AXLabel")]


def dump() -> None:
    print("UI:", " | ".join(labels()[:40]), flush=True)


def has(*needles: str) -> bool:
    labs = [l.lower() for l in labels()]
    return all(any(n.lower() in l for l in labs) for n in needles)


def find(label: str, partial: bool = True) -> dict | None:
    matches = []
    for e in describe():
        ax = e.get("AXLabel") or ""
        if e.get("type") == "Application" or not ax:
            continue
        ok = (label.lower() in ax.lower()) if partial else (ax == label)
        if ok:
            matches.append(e)
    if not matches:
        return None
    matches.sort(key=lambda e: (e["frame"]["width"] * e["frame"]["height"], e["frame"]["y"]))
    return matches[0]


def center(el: dict) -> tuple[int, int]:
    f = el["frame"]
    return int(f["x"] + f["width"] / 2), int(f["y"] + f["height"] / 2)


def tap_xy(x: float, y: float, wait: float = 1.0, note: str = "") -> None:
    print(f"tap ({int(x)},{int(y)}) {note}", flush=True)
    idb("ui", "tap", str(int(x)), str(int(y)))
    sleep(wait)


def tap(label: str, wait: float = 1.15, retries: int = 5, partial: bool = True) -> bool:
    for i in range(retries):
        el = find(label, partial=partial)
        if el:
            x, y = center(el)
            print(f"tap '{el.get('AXLabel')}' @ ({x},{y})", flush=True)
            idb("ui", "tap", str(x), str(y))
            sleep(wait)
            return True
        sleep(0.4, f"wait '{label}' {i+1}/{retries}")
    print(f"!! missing '{label}'", flush=True)
    dump()
    return False


def swipe_up(wait: float = 0.65) -> None:
    idb("ui", "swipe", "201", "670", "201", "260")
    sleep(wait)


def swipe_down(wait: float = 0.65) -> None:
    idb("ui", "swipe", "201", "260", "201", "670")
    sleep(wait)


def tab(name: str, wait: float = 1.25) -> None:
    x, y = TABS[name]
    tap_xy(x, y, wait=wait, note=f"tab {name}")


def back() -> None:
    if not tap("Back", retries=2, wait=1.0):
        if not tap("Close", retries=2, wait=1.0):
            tap_xy(28, 78, wait=1.0, note="back fallback")


def silent_stage(stage: str) -> None:
    """Jump stage with no Presenter controls UI (relaunch + launch arg)."""
    print(f"silent stage → {stage}", flush=True)
    run(["xcrun", "simctl", "terminate", UDID, BUNDLE], check=False)
    sleep(0.35)
    run(["xcrun", "simctl", "launch", UDID, BUNDLE, "-JourneyStage", stage], check=False)
    sleep(1.8, f"relaunch at {stage}")
    idb("focus", check=False)


def show_sample_applications() -> None:
    """Load multi-status applications without opening Presenter controls."""
    silent_stage("applied")


def ensure_app() -> None:
    run(["xcrun", "simctl", "terminate", UDID, BUNDLE], check=False)
    sleep(0.5)
    run(["xcrun", "simctl", "launch", UDID, BUNDLE])
    sleep(2.2)
    idb("focus", check=False)


def start_recording() -> subprocess.Popen:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if OUT.exists():
        OUT.unlink()
    cmd = ["xcrun", "simctl", "io", UDID, "recordVideo", "--codec=h264", "--force", str(OUT)]
    print("+", " ".join(cmd), flush=True)
    return subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def stop_recording(proc: subprocess.Popen) -> None:
    proc.send_signal(signal.SIGINT)
    try:
        proc.wait(timeout=30)
    except subprocess.TimeoutExpired:
        proc.kill()
    sleep(1.5, "finalize mp4")


def section(title: str) -> None:
    print(f"\n=== {title} ===", flush=True)


def walkthrough() -> None:
    # 1) Onboarding — natural
    section("1 Onboarding")
    sleep(1.8, "name")
    for _ in range(7):
        if has("create profile"):
            tap("Create profile")
            break
        if has("25–34"):
            tap("25–34", retries=1)
        tap("Continue")
        sleep(0.65)
    sleep(1.8, "home")

    # 2) Home overview (no presenter sheet)
    section("2 Home")
    sleep(1.6, "next best action + stats")
    swipe_up()
    sleep(0.8, "near you")
    swipe_down()

    # 3) Profile
    section("3 Profile")
    tap("Profile")
    sleep(1.5, "hero + skills")
    swipe_up()
    sleep(0.7)
    swipe_up()
    sleep(0.9, "privacy + language")
    if has("हिंदी"):
        tap("हिंदी")
        sleep(1.3, "Hindi")
        swipe_up()
        tap("English")
        sleep(1.0)
    for _ in range(4):
        if has("workforce journey") or has("my workforce"):
            break
        swipe_up(0.45)
    if tap("Workforce Journey") or tap("My Workforce Journey"):
        sleep(1.7, "journey")
        swipe_up()
        sleep(0.8)
        back()
    tap("Close")

    # 4) Skills via natural home CTA + hub
    section("4 Skills")
    if has("start assessment"):
        tap("Start assessment")
    else:
        tab("skills")
        tap("Skill Assessment")
    for _ in range(5):
        if has("assessment saved") or has("explore opportunities"):
            break
        if tap("Working knowledge", retries=2):
            sleep(1.0, "estimated result")
            tap("Continue")
    sleep(1.2)
    if has("explore opportunities"):
        tap("Explore Opportunities")
    else:
        back()
        tab("skills")
    if has("my skill map") or True:
        tab("skills")
        if tap("My Skill Map", retries=3):
            sleep(1.7, "radar + bars")
            swipe_up()
            sleep(1.0)
            back()

    # 5) Opportunities → transition → enrol (natural CTAs)
    section("5 Opportunities + Transition + Enrol")
    tab("opportunities")
    sleep(1.4, "cards")
    for chip in ("Near me", "Short training", "High demand", "All"):
        tap(chip, retries=2)
        sleep(0.8)
    swipe_up()
    if tap("View Path"):
        sleep(1.7, "bridge")
        swipe_up()
        sleep(1.0)
        tap("Path B", retries=3)
        sleep(0.9)
        tap("Path A", retries=3)
        sleep(0.9)
        if tap("Start Transition"):
            sleep(1.3, "training recs")
            swipe_up()
            if tap("Compare", retries=3):
                sleep(1.2)
                tap("Close")
            if tap("Start Training"):
                sleep(1.2, "centres")
                tap("Gurugram EV Skill Hub", retries=2)
                sleep(0.9)
                tap("Okhla Skill Development Centre", retries=2)
                sleep(0.9)
                swipe_up()
                sleep(1.2, "map + seats")
                if tap("Enrol"):
                    sleep(0.7)
                    tap("Confirm enrolment")
                    sleep(1.5)

    # 6) Training journey — natural continue, then silent mid-training if needed
    section("6 Training")
    tab("training")
    sleep(1.2)
    if tap("Week", retries=3) or tap("Continue Training", retries=2):
        sleep(1.5, "journey")
        swipe_up()
        sleep(0.9)
        if has("continue training"):
            tap("Continue Training")
            sleep(1.0)
    # Move to week-3 state without showing presenter sheet
    if not has("bms") and not has("52%"):
        silent_stage("trainingInProgress")
        tab("training")
        tap("Week", retries=3)
        sleep(1.5)
        swipe_up()
    if tap("Skill progress") or tap("View skill progress") or tap("Continue Training", retries=2):
        # Prefer progress screen
        if has("continue training") and not has("before"):
            # opened journey again; try progress from hub
            back()
            tab("training")
            tap("Skill progress", retries=3)
        sleep(1.7, "before/after")
        if tap("Complete certification", retries=3):
            sleep(2.0, "certified")
        else:
            silent_stage("certified")
            sleep(1.0)
        back()
    else:
        silent_stage("certified")

    # 7) Jobs — natural apply; silent advance for tracker (no presenter sheet)
    section("7 Jobs")
    tab("home")
    sleep(1.2, "certified home card")
    if has("view jobs"):
        tap("View jobs")
    tab("jobs")
    sleep(1.3)
    tap_xy(120, 150, wait=1.0, note="Matches")
    sleep(1.1)
    swipe_up()
    if tap("Apply"):
        sleep(0.7)
        if not tap("Confirm apply", retries=3):
            tap("Confirm", retries=2)
        sleep(1.3)
    tap_xy(282, 150, wait=1.1, note="Applications")
    sleep(1.6, "application tracker")
    swipe_up()
    sleep(0.9)
    # Show applications at several statuses (silent; no presenter sheet)
    show_sample_applications()
    tab("jobs")
    tap_xy(282, 150, wait=1.1, note="Applications")
    sleep(1.8, "multi-status applications")
    swipe_up()
    sleep(1.0)

    # 8) Outcome
    section("8 Outcome")
    silent_stage("placed")
    tab("home")
    sleep(1.5, "placed home")
    if tap("View outcome"):
        sleep(1.6, "congrats")
        swipe_up()
        sleep(1.0)
        if has("skip"):
            tap("Skip")
            sleep(1.2)
        else:
            back()

    # Final tabs in placed state
    section("9 Final tour")
    tab("opportunities")
    sleep(1.3)
    tab("skills")
    sleep(1.2)
    if tap("My Skill Map", retries=2):
        sleep(1.4)
        back()
    tab("training")
    sleep(1.2)
    tab("jobs")
    tap_xy(120, 150, wait=0.9, note="Matches")
    sleep(1.2)
    tap_xy(282, 150, wait=0.9, note="Applications")
    sleep(1.4)
    tab("home")
    sleep(2.2, "final hold")


def main() -> int:
    print(f"Recording → {OUT}", flush=True)
    print("Presenter controls sheet will NOT be opened.", flush=True)
    run(["open", "-a", "Simulator"], check=False)
    run(["osascript", "-e", 'tell application "Simulator" to activate'], check=False)
    sleep(0.8)
    idb("connect", check=False)
    idb("focus", check=False)
    ensure_app()
    dump()

    rec = start_recording()
    sleep(1.0, "recorder warm-up")
    try:
        walkthrough()
    except Exception as exc:
        print(f"Walkthrough error: {exc}", flush=True)
        dump()
    finally:
        stop_recording(rec)

    if OUT.exists() and OUT.stat().st_size > 200_000:
        print(f"SUCCESS: {OUT} ({OUT.stat().st_size/1e6:.1f} MB)", flush=True)
        return 0
    print("FAILED", flush=True)
    return 1


if __name__ == "__main__":
    sys.exit(main())
