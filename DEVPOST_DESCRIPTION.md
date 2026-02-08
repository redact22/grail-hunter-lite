# DevPost Description — Copy-Paste Ready

## Title
Grail Hunter Lite — AI Vintage Fashion Authentication

## Tagline
5 Gemini APIs. Real forensics. Built for thrifters.

## What it does

Grail Hunter brings forensic-grade authentication to the $350B secondhand fashion market — where a $450B counterfeit industry means every purchase is a gamble.

Point your camera at any thrift store find. The AI runs a 4-phase forensic pipeline — Visual Thought Signature, Taxonomy Classification, Market Delta Analysis, and Authentication Verdict — delivering a structured report with confidence score, era dating, material composition, red flags, and estimated market value.

This isn't a "upload image, get answer" wrapper. It's a multi-API forensic system that moves authentication upstream — to the thrift store shelf, not the returns desk.

## How we built it — 5 Gemini APIs across 3 models

1. **Vision + Extended Thinking** (`gemini-3-flash-preview`): Core forensic scan using `thinkingLevel: high` with structured JSON output. Analyzes label construction, stitching patterns, hardware details, fabric composition, and brand-specific authentication markers across 7 forensic checkpoints.

2. **Search Grounding** (`gemini-3-flash-preview`): The Intel tab provides real-time vintage fashion intelligence backed by live Google Search results — market trends, brand histories, authentication tips with source citations.

3. **Maps Grounding** (`gemini-2.5-flash`): Discovers nearby vintage/thrift stores using location-aware search. Shows names, addresses, and map links based on real geolocation.

4. **Text-to-Speech** (`gemini-2.5-flash-preview-tts`): Generates spoken audio briefings of scan results using the Kore voice — hands-free authentication while browsing store racks.

5. **Veo 3.1** (`veo-3.1-fast-generate-preview`): Creates cinematic product reels for social sharing — turn your vintage find into shareable content.

## What makes it different

- **Real FTC data**: The RN/WPL Dating Engine uses actual Federal Trade Commission Registration Numbers to date garments by manufacturer. Type RN 14806 → Carhartt, established 1959.
- **Forensic reasoning chain**: Watch the AI think in real-time with a typewriter effect showing each phase of analysis — not a black box.
- **77 automated tests**: Production-grade quality with TypeScript strict mode and comprehensive test coverage.
- **Works without an API key**: Full simulation mode lets judges experience every feature without provisioning credentials.
- **337KB total bundle**: Zero bloat. React + Gemini SDK + nothing else.

## Challenges we ran into

Extended Thinking with structured output required careful prompt engineering to reliably produce valid JSON across diverse garment types. The reasoning chain needed to balance thoroughness (detecting subtle authentication markers) with response time (users expect results in seconds, not minutes). We solved this with a 45-second timeout that falls back to simulation data, ensuring the UX never breaks.

Maps Grounding required model-specific routing — `gemini-3-flash-preview` doesn't support Maps tools, so we route map queries to `gemini-2.5-flash` with dynamic tool configuration.

## What we learned

The "Action Era" for Gemini APIs means going beyond simple prompt-response patterns. By combining 5 distinct APIs into a single workflow — where the output of Vision analysis feeds into Search Grounding for market context, which feeds into TTS for audio delivery — we built a forensic pipeline that's greater than the sum of its parts.

## What's next

- Blockchain-backed provenance certificates linking forensic reports to tamper-proof ownership history
- Batch scanning for professional resellers processing hundreds of items daily
- Community-powered authentication where expert thrifters validate and refine AI findings
- Integration with resale platforms (Depop, Grailed, Poshmark) for one-tap listing with verified authentication

## Built with

- Gemini 3 Flash Preview (Vision + Extended Thinking + Search Grounding)
- Gemini 2.5 Flash (Maps Grounding)
- Gemini 2.5 Flash Preview TTS (Text-to-Speech)
- Veo 3.1 (Video Generation)
- React 19
- TypeScript (strict mode)
- Tailwind CSS
- Vite
- Vercel

## Third-party disclosure (non-Gemini)

Hosted on **Vercel**; frontend built with **React**, **Tailwind CSS**, and **Lucide React** (MIT/ISC licensed OSS); sample market images are **Unsplash** links (used under Unsplash terms for demo/editorial display); RN lookup uses public **FTC RN** reference data (no FTC endorsement); nearby store/map and web intel are provided through Gemini grounding on **Google Maps/Search** with source attribution.

## Try it out

- **Live Demo**: https://grail-hunter-lite-claremont2542-2062s-projects.vercel.app
- **Source Code**: https://github.com/redact22/grail-hunter-lite
