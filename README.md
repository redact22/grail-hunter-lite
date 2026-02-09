# GRAIL HUNTER — AI-Powered Vintage Authentication Scanner

**Gemini 3 API Hackathon Submission** | [Live Demo](https://grail-hunter-lite-claremont2542-2062s-projects.vercel.app) | [DevPost](https://devpost.com/software/thrift-finds-ai-forensic-authentication-system)

Grail Hunter is a forensic authentication tool for vintage fashion. Point your camera at any thrift store find — the AI identifies the item, dates it using label forensics, estimates market value, and delivers a full authentication verdict with reasoning chain.

## 5 Gemini API Surfaces

All Gemini calls route through secure serverless functions — zero API keys in the client bundle.

| API Surface | Model | Serverless Route | What It Does |
|-------------|-------|-----------------|-------------|
| **Vision** (multimodal) | `gemini-3-flash-preview` | `/api/scan` | Analyzes garment images with inline base64 data |
| **Extended Thinking** | `gemini-3-flash-preview` | `/api/scan` | Deep forensic reasoning with `thinkingLevel: HIGH` |
| **Structured Output** | `gemini-3-flash-preview` | `/api/scan`, `/api/styling` | Enforced JSON schema responses |
| **Search Grounding** | `gemini-3-flash-preview` | `/api/assistant` | Real-time market intelligence backed by Google Search |
| **Maps Grounding** | `gemini-2.5-flash` | `/api/stores` | Discovers nearby vintage stores using location-aware search |

## Features

- **Forensic Report Panel** — 4-phase reasoning chain: Visual Thought Signature → Taxonomy → Market Delta → Authentication Verdict
- **Confidence Ring** — Animated SVG gauge with color-coded authentication confidence
- **RN/WPL Dating** — Real textile forensics using FTC Registration Numbers (formula: `year = 1959 + ⌊(RN - 13670) / 2635⌋`)
- **Badge System** — 6 collectible achievements (First Scan, Eagle Eye, Grail Hunter, Forensic Expert, Authenticator, Void Walker)
- **Market Ticker** — Live trending items with price movements
- **Intel Chat** — Search-grounded Q&A about vintage fashion markets
- **Nearby Stores** — Maps-grounded vintage store discovery
- **Live/Simulation Badge** — Dynamic indicator showing whether real Gemini AI or fallback data is active
- **Cinematic Splash** — Boot sequence with forensic terminal aesthetic
- **Audio Briefings** — Browser SpeechSynthesis for hands-free scan results

## Security

- **Zero client-side API keys** — All `@google/genai` imports removed from client code; tree-shaking eliminates the SDK from the bundle
- **Origin validation** — `checkOrigin()` on every serverless function blocks cross-origin requests
- **Rate limiting** — Per-IP, per-route, 10 requests/minute window
- **Input validation** — Image size limit (4.5MB), prompt length limit (4000 chars), required field checks
- **Error sanitization** — Server errors return generic messages, never internal details

## Tech Stack

- **React 19** + TypeScript (strict mode)
- **Vite** — build tool
- **Tailwind CSS 3.4** — utility-first styling
- **Vercel** — serverless functions + static hosting
- **Lucide React** — icons
- **Vitest** + React Testing Library — 77 tests across 13 files

## Quick Start

```bash
# Install
npm install

# Set your Gemini API key (server-side only)
echo "GEMINI_API_KEY=your-key-here" > .env

# Run with serverless functions locally
npx vercel dev

# Run tests (77 tests across 13 files)
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # 17 React components
│   ├── Scanner.tsx      # Camera capture + scan orchestration
│   ├── ForensicReportPanel.tsx  # Full authentication report
│   ├── ConfidenceRing.tsx       # Animated SVG confidence gauge
│   ├── ReasoningChain.tsx       # Step-by-step forensic reasoning
│   ├── RNLookupCard.tsx         # RN/WPL textile dating
│   ├── AssistantChat.tsx        # Search-grounded intel chat
│   ├── NearbyStores.tsx         # Maps-grounded store finder
│   ├── BadgeGallery.tsx         # Achievement badge grid
│   ├── BadgeUnlock.tsx          # Full-screen unlock celebration
│   ├── MarketTicker.tsx         # Live market price ticker
│   └── ...
├── services/
│   └── geminiService.ts # API proxy client (routes to /api/* serverless functions)
├── data/
│   ├── rn-database.ts   # 18-brand RN lookup database
│   ├── rn-dating.ts     # FTC dating formula + analysis
│   └── badges.ts        # 6 badge definitions
├── hooks/               # useScanHistory, useFavorites, useBadges
├── lib/                 # Safe localStorage + ErrorBoundary
└── styles/              # CSS animations + Liquid Obsidian design system
api/
├── scan.ts              # POST /api/scan — Gemini Vision + Extended Thinking
├── assistant.ts         # POST /api/assistant — Search-grounded Q&A
├── styling.ts           # POST /api/styling — Structured styling advice
├── stores.ts            # POST /api/stores — Maps-grounded store discovery
└── _rateLimit.ts        # Shared rate limiting + origin validation
```

## Design System: Liquid Obsidian

Optimized for low-light thrift store environments:

- **Deep Charcoal** `#0A0A0F` — Prevents OLED smear and halation
- **Patina Teal** `#2BF3C0` — Primary accent for CTAs and active states
- **Google Blue** `#4285F4` — API indicator badges
- **1px borders** at `white/[0.08]` — Crisp card edges without heavy shadows

## Contributing

This repository is standalone and **must not** use monorepo-only aliases.

- Use relative or local standalone-safe imports (for example: `./lib/safe-storage`, `../lib/safe-storage`, or `@/` only if locally configured).
- Do not import from `@mini-apps/*` (these aliases only exist in internal monorepos and will break CI/builds here).
- Run `npm run check:imports` before opening a PR.

## License

MIT
