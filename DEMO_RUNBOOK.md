# GRAIL HUNTER — 3-Minute Demo Runbook

## Pre-Demo Checklist

- [ ] Clear localStorage (DevTools > Application > Clear Site Data) for fresh badges
- [ ] Have 3 demo images ready in phone gallery or Downloads folder:
  1. **Authentic vintage** — Carhartt jacket or Halston caftan (triggers high confidence)
  2. **Modern reproduction** — Fast fashion knockoff (triggers red flags)
  3. **Grail-tier** — Rare designer piece (triggers "GRAIL FOUND" verdict)
- [ ] Phone: camera permissions pre-granted (avoid first-run prompt during demo)
- [ ] Laptop fallback: use "Upload Evidence" if camera isn't available
- [ ] Tab: start on SCAN tab (default)

---

## Demo Flow (3:00)

### 0:00–0:30 — HOOK: Cinematic Splash

> **What judges see:** Dark screen boots up with terminal-style log messages, then "ENTER THE VAULT" button with pulsing ring.

**Action:** Click "ENTER THE VAULT"

**Say:** _"Grail Hunter is an AI-powered vintage fashion authentication scanner. It uses five Gemini APIs in one app. Let me show you."_

---

### 0:30–1:00 — SCAN: Live Authentication

> **What judges see:** Scanner HUD with forensic phase labels cycling: "Visual Thought Signature...", "Taxonomy Analysis...", "Authentication Verdict..."

**Action:**

1. Click **"Upload Evidence"** (or "Start Live Scan" if camera works)
2. Select the **authentic vintage image** (Carhartt jacket)
3. Watch the scan animation with progress bar + HUD phases

**Say:** _"The scanner uses Gemini Vision with extended thinking — it doesn't just classify, it reasons through the authentication like a forensic expert."_

**Badge trigger:** "First Scan" badge unlocks! (full-screen celebration overlay, auto-dismiss 3s)

---

### 1:00–2:00 — FORENSIC REPORT: The Hero Moment

> **What judges see:** ForensicReportPanel slides up — verdict, confidence ring, reasoning chain, red flags, material composition bars, market value.

**Action:** Scroll through the report slowly

**Say:** _"The reasoning chain shows each phase of analysis — visual signature, taxonomy, market delta. The confidence ring visualizes authentication certainty. These red flags would alert a buyer to specific concerns."_

**Then:** Scroll down to **RN Lookup Card**

**Action:** Type `14806` (Carhartt's RN number)

**Say:** _"This is real forensic data — the RN dating formula calculates manufacturing year from the FTC registration number. Carhartt 14806 dates to approximately 1959. This is a genuine textile authentication technique used by vintage experts."_

---

### 2:00–2:30 — INTEL + MAP: Grounding APIs

> **What judges see:** Chat interface with Search grounding, Map with nearby store pins.

**Action:**

1. Click **Intel** tab → type "What are the most valuable Halston pieces?"
2. Click **Map** tab → show nearby vintage stores

**Say:** _"The Intel tab uses Gemini Search grounding for real-time market knowledge. The Map uses Maps grounding to find nearby vintage stores."_

**Badge trigger:** Visiting all 4 tabs (Scan → Market → Intel → Map) unlocks "Void Walker" badge!

---

### 2:30–2:50 — MARKET: Live Pricing

> **What judges see:** Market ticker scrolling + listing cards with live price fluctuations + trending indicators.

**Action:** Click **Market** tab (should already be visited), tap a listing card to open DetailModal

**Say:** _"The market view shows live price movements for tracked grails. Each card has real-time trending data."_

---

### 2:50–3:00 — CLOSE: The Pitch

**Say:** _"Five Gemini APIs — Vision, Search grounding, Maps grounding, TTS, and Veo. One app. Built for the thrift economy."_

---

## Badge Triggers (know these cold)

| Badge           | How to Trigger               | When It Fires                        |
| --------------- | ---------------------------- | ------------------------------------ |
| First Scan      | Complete 1 scan              | After first upload/camera scan       |
| Void Walker     | Visit all 4 tabs             | After clicking the 4th unvisited tab |
| Eagle Eye       | 3 scans with >90% confidence | After 3rd high-confidence scan       |
| Grail Hunter    | Find a "Grail" rarity item   | After scanning a grail-tier item     |
| Forensic Expert | Complete 10 scans            | After 10th scan                      |
| Authenticator   | 5 authentic items            | After 5th authentic scan             |

## API Showcase Mapping

| Gemini API            | Where It Shows            | Demo Moment                      |
| --------------------- | ------------------------- | -------------------------------- |
| **Vision**            | Scan tab — image analysis | Upload/camera scan               |
| **Extended Thinking** | Reasoning chain in report | Forensic panel scroll            |
| **Structured Output** | Parsed result fields      | Confidence ring + red flags      |
| **Search Grounding**  | Intel tab chat            | Ask market question              |
| **Maps Grounding**    | Map tab store pins        | Show nearby stores               |
| **TTS**               | Audio briefing button     | "Audio Brief" in report          |
| **Veo 3.1**           | Video generation          | DetailModal video (if generated) |

## Emergency Fallbacks

| Problem                      | Fix                                                 |
| ---------------------------- | --------------------------------------------------- |
| Camera blocked               | Use "Upload Evidence" instead                       |
| API key missing              | App shows "Simulation" mode — mock data still works |
| Scan takes too long          | Progress bar + phase labels keep judges engaged     |
| Badge doesn't fire           | Scan count may be cached — clear localStorage       |
| Images blacked out on Market | Hard refresh (Ctrl+Shift+R)                         |

## Killer Lines for Q&A

- _"The RN dating formula is a real forensic technique — it's not AI-generated, it's textile science."_
- _"Extended thinking means the model shows its work — judges can see the reasoning, not just the answer."_
- _"Five APIs, zero page reloads. It's a single-page app with 341KB bundle."_
- _"The gamification layer creates stickiness — users come back to unlock badges and track their scan history."_
