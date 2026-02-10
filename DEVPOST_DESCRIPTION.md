# DevPost Description — Copy-Paste Ready

## Title
Grail Hunter Lite — AI Vintage Fashion Authentication

## Tagline
5 Gemini APIs. Real forensics. Zero client-side keys. Built for thrifters.

## What it does

Grail Hunter brings forensic-grade authentication to the $350B secondhand fashion market — where a $450B counterfeit industry means every purchase is a gamble. In this decentralized, peer-to-peer ecosystem, information asymmetry is extreme: the value of a vintage garment depends on minute details — specific manufacturer iterations, hardware oxidation, label typography — tribal knowledge held by a small cadre of collectors. Grail Hunter is the technological equalizer.

Point your camera at any thrift store find. The AI runs a 4-phase forensic pipeline — Visual Thought Signature, Taxonomy Classification, Market Delta Analysis, and Authentication Verdict — delivering a structured report with confidence score, era dating, material composition, red flags, and estimated market value.

This isn't a "upload image, get answer" wrapper. It's a multi-API forensic system that moves authentication upstream — to the thrift store shelf, not the returns desk.

## How we built it — 5 Gemini APIs across 2 models

Every Gemini call routes through secure serverless functions — the API key never touches the client bundle.

1. **Vision + Extended Thinking** (`gemini-3-flash-preview`): Core forensic scan using `thinkingLevel: HIGH` with structured JSON output. Analyzes label construction, stitching patterns, hardware details, fabric composition, and brand-specific authentication markers across 7 forensic checkpoints. The model reasons through authentication like a forensic expert before returning a structured verdict.

2. **Structured Output** (`gemini-3-flash-preview`): Enforced JSON schema responses via `responseMimeType: 'application/json'` + `responseSchema`. Every scan and styling request returns parseable, typed data — no regex, no hope-based parsing.

3. **Search Grounding** (`gemini-3-flash-preview`): The Intel tab provides real-time vintage fashion intelligence backed by live Google Search results — market trends, brand histories, authentication tips with source citations.

4. **Maps Grounding** (`gemini-2.5-flash`): Discovers nearby vintage/thrift stores using location-aware search with `googleMaps` tool configuration. Shows names and map links based on real geolocation.

5. **Chat / Styling Intelligence** (`gemini-3-flash-preview`): Dedicated styling endpoint generates elite outfit pairings, occasion recommendations, and styling strategy tailored to the authenticated item.

**Bonus**: Browser-native SpeechSynthesis provides hands-free audio briefings of scan results — no additional API key required.

## What makes it different

- **Zero client-side API keys**: All Gemini calls route through `/api/*` serverless functions with origin validation and per-IP rate limiting. The production JS bundle contains zero secrets.
- **Real FTC data**: The RN/WPL Dating Engine uses actual Federal Trade Commission Registration Numbers to date garments by manufacturer. Type RN 14806 → Carhartt, established 1959.
- **Forensic reasoning chain**: Watch the AI think in real-time with a typewriter effect showing each phase of analysis — not a black box.
- **77 automated tests**: Production-grade quality with TypeScript strict mode and comprehensive test coverage across 13 test files.
- **Graceful degradation**: Full simulation mode lets judges experience every feature even if the API is temporarily unavailable — the app adapts dynamically and shows a Live/Simulation badge.
- **Origin-guarded API**: Serverless functions validate request origins against a production allowlist, blocking cross-origin abuse.

## Challenges we ran into

**Extended Thinking with structured output** required careful prompt engineering to reliably produce valid JSON across diverse garment types. The reasoning chain needed to balance thoroughness (detecting subtle authentication markers) with response time (users expect results in seconds, not minutes). We solved this with a 45-second timeout that falls back to simulation data, ensuring the UX never breaks.

**Maps Grounding required model-specific routing** — `gemini-3-flash-preview` doesn't support Maps tools, so we route map queries to `gemini-2.5-flash` with dynamic tool configuration.

**Serverless ESM resolution** — Vercel compiles TypeScript to JavaScript but preserves import paths verbatim. With `"type": "module"` in package.json, Node.js strict ESM mode requires explicit `.js` extensions on relative imports. Every serverless function crashed with `ERR_MODULE_NOT_FOUND` until we added the extensions — a subtle deployment bug invisible in local development.

**The Simulation Mode Paradox** — we built a simulation fallback so the UI works without API keys during development. After deploying to Vercel, every scan returned perfect results — a BAPE jacket authenticated at 95% confidence with detailed forensic reasoning. It looked flawless. Then we checked `vercel env ls`: zero environment variables. The app was replaying hardcoded mock data, and the UI was indistinguishable from real AI output. We call this the "Illusion of Competence" — when your fallback data is too good, you can't tell the difference between a working AI and a confident liar. The fix: a dynamic Live/Simulation badge that tracks real API health, plus mandatory `vercel env ls` verification after every deploy.

**Securing the API key** — our initial architecture exposed the Gemini key in the client bundle via Vite's `VITE_` prefix. We refactored all Gemini calls to route through serverless proxy functions, removed the client SDK entirely (tree-shaking eliminated the 200KB+ `@google/genai` package from the bundle), and added origin validation + rate limiting on every route.

## What we learned

The "Action Era" for Gemini APIs means going beyond simple prompt-response patterns. By combining 5 distinct API surfaces into a single workflow — where Vision analysis feeds into Search Grounding for market context, and Structured Output ensures every response is machine-parseable — we built a forensic pipeline that's greater than the sum of its parts.

**Security must be architected, not patched.** Moving from client-side SDK calls to serverless proxy functions wasn't just a security fix — it fundamentally improved the architecture. The client bundle shrank, the API key became invisible, and we gained server-side rate limiting and origin validation for free. The lesson: if your API key is in the bundle, it's already compromised.

**Beware the Illusion of Competence.** The most dangerous bug we shipped wasn't a crash — it was silent success. Our simulation fallback returned perfectly structured JSON that looked identical to real Gemini output. We celebrated "working" scans for an entire session before discovering zero API keys were configured. In AI applications, a correct-looking answer from a mock is indistinguishable from a correct answer from the model. The fix wasn't technical — it was operational: always verify your data source, never trust perfect results, and surface the Live/Simulation distinction prominently in the UI.

## What's next

- Blockchain-backed provenance certificates linking forensic reports to tamper-proof ownership history
- Batch scanning for professional resellers processing hundreds of items daily
- Community-powered authentication where expert thrifters validate and refine AI findings
- Integration with resale platforms (Depop, Grailed, Poshmark) for one-tap listing with verified authentication
- Autonomous "Grail Alerts" — set a watch for a specific item under a target price, and an AI agent continuously monitors listings, runs visual authentication, and notifies you when a verified match appears
- Gemini TTS integration for AI-generated voice briefings (currently using browser SpeechSynthesis)

## Built with

- Gemini 3 Flash Preview (Vision + Extended Thinking + Search Grounding + Structured Output)
- Gemini 2.5 Flash (Maps Grounding)
- React 19
- TypeScript (strict mode)
- Tailwind CSS
- Vite
- Vercel (Serverless Functions + Static Hosting)

## Third-party disclosure (non-Gemini)

Hosted on **Vercel** (serverless functions + static CDN); frontend built with **React**, **Tailwind CSS**, and **Lucide React** (MIT/ISC licensed OSS); sample market images are **Unsplash** links (used under Unsplash terms for demo/editorial display); RN lookup uses public **FTC RN** reference data (no FTC endorsement); nearby store/map and web intel are provided through Gemini grounding on **Google Maps/Search** with source attribution; audio briefings use **browser SpeechSynthesis API** (no external service).

## Try it out

- **Live Demo**: https://grail-hunter-lite-claremont2542-2062s-projects.vercel.app
- **Source Code**: https://github.com/redact22/grail-hunter-lite
